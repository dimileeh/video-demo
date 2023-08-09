import * as React from "react"
import { useState } from "react"
import { findDOMNode } from 'react-dom'

import { Grid, Box, IconButton, Fade, Dialog } from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useTheme } from '@mui/material/styles';

import { isIOS } from 'react-device-detect';

import ReactPlayer from 'react-player/vimeo'
import screenfull from 'screenfull'
import VideoControls from "./video_controls";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

const VideoContainer = ({ open, handleClose }) => {

  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [mouseMoving, setMouseMoving] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playInline, setPlayInline] = useState(true);
  const [url, setUrl] = useState('https://player.vimeo.com/video/851579304?h=79552e35bc&badge=0&autopause=0&player_id=0&app_id=58479')

  const [videoChapters, setVideoChapters] = useState([]);

  const playerRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const timerRef = React.useRef(null);

  // Watch for fullscreenchange
  React.useEffect(() => {
    function onFullscreenChange() {
      setIsFullScreen(screenfull.isFullscreen);
    }

    if (screenfull.isEnabled) {
      screenfull.on('change', () => {
        onFullscreenChange()
      })
    }

    return () => screenfull.off('change', onFullscreenChange);
  }, []);

  React.useEffect(() => {
    if (isIOS) {
      setMuted(true)
    }
  }, [])

  React.useEffect(() => {
    const vimeoPlayer = playerRef.current?.getInternalPlayer()
    if (!!vimeoPlayer) {
      vimeoPlayer.getChapters()
        .then(function (chapters) {
          // `chapters` indicates an array of chapter objects
          // [{startTime: 0, title: 'Chapter 1', index: 1}]
          setVideoChapters(chapters)
        }).catch(function (error) {
          // An error occurred
        });
    }

  }, [playerRef.current])

  const onDialogClose = () => {
    // setPlaying(true);
    // setPlayed(0);
    // setSeeking(false);
    handleClose();
  }

  const onVideoClose = () => {
    if (screenfull.isEnabled && screenfull.isFullscreen) {
      screenfull.exit();
    }
    handleClose()
  }

  const setMouseMove = (e) => {
    e.preventDefault();
    setMouseMoving(true);

    (() => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setMouseMoving(false), 3000);
    })();
  }

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleToggleMuted = () => {
    setMuted(!muted);
  }

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      setLoaded(state.loaded);
    }
  }

  const handleSeekChange = (value) => {
    setSeeking(true);
    setPlayed(parseFloat(value));
  }

  const handleRewind10Seconds = () => {
    if (playerRef.current.getCurrentTime() - 10 > 0) {
      playerRef.current.seekTo(
        playerRef.current.getCurrentTime() - 10, 'seconds'
      )
    } else {
      playerRef.current.seekTo(0, 'seconds')
    }
  }

  const handleFastForward10Seconds = () => {
    if (playerRef.current.getCurrentTime() + 10 < playerRef.current.getDuration()) {
      playerRef.current.seekTo(
        playerRef.current.getCurrentTime() + 10, 'seconds'
      )
    } else {
      playerRef.current.seekTo(
        duration, 'seconds'
      )
    }
  }

  const handleSeekMouseUp = (value) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(value));
  }

  // console.log("DEBUG: ", playInline, url)

  const handleClickFullScreen = () => {
    if (isIOS) {
      console.log("DEBUG: FULLSCREEN IOS")
      const videoElement = playerRef.current.getInternalPlayer()
      console.log("DEBUG INLINE: ", videoElement.playsInline)
      console.log("DEBUG PRESENT: ", videoElement.webkitSupportsPresentationMode)
      console.log("DEBUG FULL: ", videoElement.webkitSupportsFullscreen)

      // const vimeoPlayer = playerRef.current?.getInternalPlayer()
      // if (!!vimeoPlayer) {
      //   vimeoPlayer.
      // }
      // setPlayInline((value) => !value)
      // setUrl(`https://player.vimeo.com/video/851579304?playsinline=${playInline ? 1 : 0}&h=79552e35bc&title=0&byline=0&portrait=0&speed=0&color=cf003d&muted=1&autoplay=1&autopause=0&pip=0&controls=0&app_id=122963`)
    }

    // if (screenfull.isEnabled) {
    //   if (screenfull.isFullscreen) {
    //     screenfull.exit();
    //   } else {
    //     screenfull.request();
    //   }
    // }
  }

  const handleDuration = (duration) => {
    setDuration(duration);
  }

  const theme = useTheme();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onDialogClose}
      TransitionComponent={Transition}
    >
      <Box
        sx={(theme) => ({ backgroundColor: theme.palette.common.black, height: '100%', display: "grid" })}
        onMouseMove={setMouseMove}
      >
        {/* Player Begins */}
        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            gridArea: "1/1",
          }}
        >
          <Grid item xs={12} sm={isFullScreen ? 12 : 10} md={isFullScreen ? 12 : 8} xl={8}
            ref={containerRef}
            sx={{
              gridArea: "1/1",
              position: "relative",
              // This centers the other elements inside the hero component
              placeItems: "center",
              display: "grid",
            }}>
            <ReactPlayer
              ref={playerRef}
              url={url}
              playing={playing}
              controls={false}
              playsinline={playInline}
              width={'100%'}
              height={'auto'}
              style={{ borderRadius: 20, overflow: 'hidden', opacity: playing ? 1 : 0.7, maxWidth: `calc(${isFullScreen ? 100 : 75}vh * 16 / 9)` }}
              muted={muted}
              volume={volume}
              onPlay={handlePlay}
              onPause={handlePause}
              onProgress={handleProgress}
              onDuration={handleDuration}
              config={{
                vimeo: {
                  playerOptions: {
                    responsive: true,
                    pip: false,
                    speed: false,
                    // playsinline: playInline,
                    byline: false,
                    color: 'cf003d',
                    muted: muted,
                    controls: false,
                  }
                },
              }}
            />

          </Grid>

        </Grid>
        {/* Player Ends */}

        {/* Player Controls Begin */}
        <VideoControls
          duration={duration}
          played={played}
          playing={playing}
          seeking={seeking}
          muted={muted}
          isFullScreen={isFullScreen}
          handleClose={onVideoClose}
          mouseMoving={mouseMoving}
          handlePlayPause={handlePlayPause}
          handleToggleMuted={handleToggleMuted}
          handleClickFullScreen={handleClickFullScreen}
          handleRewind10Seconds={handleRewind10Seconds}
          handleFastForward10Seconds={handleFastForward10Seconds}
          handleSeekChange={handleSeekChange}
          handleSeekMouseUp={handleSeekMouseUp}
          containerRef={containerRef.current}
        />
        {/* Player Controls End */}


        {/* Overlay Controls Begin */}
        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            gridArea: "1/1",
          }}
        >
          <Grid item xs={12} sm={isFullScreen ? 12 : 10} md={isFullScreen ? 12 : 8} xl={8}
            sx={{
              gridArea: "1/1",
              position: "relative",
              // This centers the other elements inside the hero component
              placeItems: "center",
              display: "grid",
            }}>
            <Fade in={!playing}>
              <IconButton onClick={handlePlayPause}
                disableRipple
                sx={{
                  color: theme.palette.common.white, width: '100%', height: '100%',
                  maxHeight: '75vh',
                  maxWidth: `calc(${isFullScreen ? 100 : 75}vh * 16 / 9)`,
                  padding: `calc(${isFullScreen ? 100 : 75}vh * 4 / 9) 0`,
                  cursor: 'default'
                }}>
                {playing ? <PauseIcon sx={{ fontSize: '4rem' }} /> : <PlayArrowIcon sx={{ fontSize: '6rem' }} />}
              </IconButton>
            </Fade>
            {!!playing &&
              <IconButton onClick={handlePlayPause}
                disableRipple
                sx={{
                  opacity: 0, position: 'absolute', color: theme.palette.common.white, width: '100%', height: '100%',
                  maxHeight: '75vh',
                  maxWidth: `calc(${isFullScreen ? 100 : 75}vh * 16 / 9)`,
                  padding: `calc(${isFullScreen ? 100 : 75}vh * 4 / 9) 0`,
                  cursor: 'default'
                }}>
                <PauseIcon sx={{ fontSize: '4rem' }} />
              </IconButton>
            }
          </Grid>

        </Grid>
        {/* Overlay Controls End */}


      </Box>
    </Dialog>

  );
}

export default VideoContainer;