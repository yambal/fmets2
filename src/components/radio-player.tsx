"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Radio, Play, Pause, Volume1, Volume2, Loader } from "lucide-react";

const STREAM_URL = "http://161.33.147.217:8000/stream";
const STATUS_URL = "/api/stream/status";

const NUM_BARS = 14;
const MIN_BAR_HEIGHT = 8;
const MAX_BAR_HEIGHT = 150;

function Visualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <Box
      position="relative"
      w={{ base: "100%", md: "180px" }}
      minH="180px"
      flexShrink={0}
      bg="#252640"
      borderRadius="16px"
      overflow="hidden"
    >
      {/* Glow background */}
      <Box
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        w="60%"
        h="60%"
        borderRadius="50%"
        bg="radial-gradient(circle, rgba(124,144,112,0.25) 0%, rgba(124,144,112,0) 100%)"
      />
      {/* Bars */}
      <Flex
        position="absolute"
        bottom="30px"
        left="50%"
        transform="translateX(-50%)"
        gap="8px"
        alignItems="flex-end"
        h="150px"
      >
        {Array.from({ length: NUM_BARS }, (_, i) => (
          <Box
            key={i}
            w="12px"
            borderRadius="6px"
            bg="#7C9070"
            opacity={isPlaying ? 0.5 + Math.random() * 0.5 : 0.3}
            h={isPlaying ? undefined : `${MIN_BAR_HEIGHT}px`}
            transition="height 0.3s ease, opacity 0.3s ease"
            style={
              isPlaying
                ? {
                    animation: `barPulse${i % 4} ${0.4 + (i % 5) * 0.08}s ease-in-out infinite alternate`,
                  }
                : undefined
            }
          />
        ))}
      </Flex>
    </Box>
  );
}

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const sliderTrackRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [streamStatus, setStreamStatus] = useState<any>(null);

  // ステータス取得（表示直後に開始 + 10秒ごと）
  useEffect(() => {
    const fetchStatus = () => {
      fetch(STATUS_URL)
        .then((res) => res.json())
        .then((data) => setStreamStatus(data))
        .catch(() => {});
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // ストリームをミュートでプリロード
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = STREAM_URL;
    audio.muted = true;
    audio.volume = 0;
    audio.play().then(() => {
      startedRef.current = true;
    }).catch(() => {});

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // 再生/停止 = ミュート切り替え（既にストリーム接続済み）
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.muted = true;
      setIsPlaying(false);
    } else if (startedRef.current) {
      audio.muted = false;
      audio.volume = volume;
      setIsPlaying(true);
    } else {
      setIsLoading(true);
      audio.src = STREAM_URL;
      audio.volume = volume;
      audio.muted = false;
      const onPlaying = () => {
        startedRef.current = true;
        setIsLoading(false);
        setIsPlaying(true);
        audio.removeEventListener("playing", onPlaying);
      };
      audio.addEventListener("playing", onPlaying);
      audio.play().catch((err) => {
        console.error("Stream playback failed:", err);
        setIsLoading(false);
      });
    }
  }, [isPlaying, volume]);

  const handleVolumeChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const track = sliderTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setVolume(ratio);
      if (audioRef.current) {
        audioRef.current.volume = ratio;
      }
    },
    []
  );

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} preload="none" />
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes barPulse0 { from { height: ${MIN_BAR_HEIGHT}px; } to { height: ${MAX_BAR_HEIGHT * 0.9}px; } }
        @keyframes barPulse1 { from { height: ${MIN_BAR_HEIGHT}px; } to { height: ${MAX_BAR_HEIGHT * 0.7}px; } }
        @keyframes barPulse2 { from { height: ${MIN_BAR_HEIGHT}px; } to { height: ${MAX_BAR_HEIGHT * 0.5}px; } }
        @keyframes barPulse3 { from { height: ${MIN_BAR_HEIGHT}px; } to { height: ${MAX_BAR_HEIGHT * 0.8}px; } }
      `}</style>
      <Box
        w="100%"
        bg="#1A1B2E"
        borderRadius="20px"
        p="32px 28px"
        display="flex"
        flexDirection="column"
        gap="24px"
      >
        {/* Header */}
        <Flex w="100%" align="center" justify="space-between">
          <Flex align="center" gap="10px">
            <Radio size={22} color="#7C9070" />
            <Text
              fontFamily="var(--font-fraunces)"
              fontSize="20px"
              fontWeight="600"
              color="#F7F6F3"
              letterSpacing="-0.5px"
            >
              FM ETS2 JP
            </Text>
          </Flex>
          <Flex
            align="center"
            gap="6px"
            bg="#7C907025"
            borderRadius="20px"
            px="12px"
            py="5px"
          >
            <Box
              w="8px"
              h="8px"
              borderRadius="50%"
              bg={streamStatus?.isStreaming !== false ? "#7C9070" : "#8E8E93"}
            />
            <Text
              fontFamily="var(--font-plus-jakarta-sans)"
              fontSize="11px"
              fontWeight="600"
              color={streamStatus?.isStreaming !== false ? "#7C9070" : "#8E8E93"}
              letterSpacing="1px"
            >
              {streamStatus?.isStreaming !== false ? "ON AIR" : "OFFLINE"}
            </Text>
          </Flex>
        </Flex>

        {/* Body: vertical on narrow, horizontal on wide */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap="24px"
          align="stretch"
        >
          {/* Visualizer */}
          <Visualizer isPlaying={isPlaying} />

          {/* Controls */}
          <Flex
            direction="column"
            gap="20px"
            justify="center"
            align="center"
            flex="1"
          >
            {/* Track Info */}
            <Flex direction="column" align="center" gap="6px">
              <Text
                fontFamily="var(--font-fraunces)"
                fontSize="22px"
                fontWeight="500"
                color="#F7F6F3"
                letterSpacing="-0.5px"
                textAlign="center"
              >
                {streamStatus?.currentTrack?.title || "FM ETS2 JP"}
              </Text>
              <Text
                fontFamily="var(--font-plus-jakarta-sans)"
                fontSize="14px"
                color="#8E8E93"
                textAlign="center"
              >
                {streamStatus?.currentTrack?.artist || "ライブストリーミング中"}
              </Text>
              {streamStatus?.listeners != null && (
                <Text
                  fontFamily="var(--font-plus-jakarta-sans)"
                  fontSize="12px"
                  color="#6B6B6B"
                  textAlign="center"
                >
                  {streamStatus.listeners} リスナー
                </Text>
              )}
            </Flex>

            {/* Divider */}
            <Box w="100%" h="1px" bg="#F0EFEC15" />

            {/* Play Button */}
            <Box
              as="button"
              w="64px"
              h="64px"
              borderRadius="50%"
              bg="#7C9070"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              boxShadow="0 4px 20px rgba(124,144,112,0.25)"
              _hover={{ opacity: 0.9 }}
              transition="opacity 0.2s"
              onClick={togglePlay}
              border="none"
              flexShrink={0}
            >
              {isLoading ? (
                <Loader size={28} color="#FFFFFF" style={{ animation: "spin 1s linear infinite" }} />
              ) : isPlaying ? (
                <Pause size={28} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
              )}
            </Box>

            {/* Volume */}
            <Flex align="center" gap="12px" w="100%">
              <Volume1 size={18} color="#8E8E93" />
              <Box
                ref={sliderTrackRef}
                flex="1"
                h="4px"
                bg="#F0EFEC20"
                borderRadius="2px"
                position="relative"
                cursor="pointer"
                onClick={handleVolumeChange}
              >
                <Box
                  h="4px"
                  bg="#7C9070"
                  borderRadius="2px"
                  w={`${volume * 100}%`}
                  transition="width 0.1s"
                />
                <Box
                  position="absolute"
                  top="50%"
                  left={`${volume * 100}%`}
                  transform="translate(-50%, -50%)"
                  w="12px"
                  h="12px"
                  borderRadius="50%"
                  bg="#F7F6F3"
                  boxShadow="0 2px 6px rgba(0,0,0,0.19)"
                  pointerEvents="none"
                />
              </Box>
              <Volume2 size={18} color="#8E8E93" />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
