import * as React from "react"
import { findDOMNode } from 'react-dom'
import { useState } from "react"

import { Grid, Box, Container, IconButton, ButtonBase, Button, Typography, Fade, Dialog, Paper, LinearProgress, Slider, Stack, Slide } from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import ArticleIcon from '@mui/icons-material/Article';
import MicIcon from '@mui/icons-material/Mic';
import { styled, useTheme } from '@mui/material/styles';

import ReactPlayer from 'react-player/vimeo'
import screenfull from 'screenfull'
import { VideoCameraFront } from "@mui/icons-material"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator?.userAgentData?.platform)
    // iPad on iOS 13 detection
    || (navigator?.userAgent.includes("Mac") && "ontouchend" in document)
}

const VideoContainer = ({open, handleClose}) => {

  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [mouseMoving, setMouseMoving] = useState(true);

  const playerRef = React.useRef(null);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!!iOS()) {
      setMuted(true)
    }
  }, [])

  const onClose = () => {
    // setPlaying(true);
    // setPlayed(0);
    // setSeeking(false);
    handleClose();
  }

  const setMouseMove = (e) => {
    e.preventDefault();
    setMouseMoving(true);

    let timeout;
    (() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setMouseMoving(false), 6000);
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

  const handleClickFullScreen = () => {
    screenfull.request(findDOMNode(playerRef.current));
  }

  const handleDuration = (duration) => {
    setDuration(duration);
  }


  const theme = useTheme();

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    const intSeconds = Math.floor(seconds % 60); // Truncate the fractional part

    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(intSeconds).padStart(2, '0');

    return (hours > 0 ? String(hours).padStart(2, '0') + ':' : '') + paddedMinutes + ':' + paddedSeconds;
  }

  const TinyText = styled(Typography)({
    fontSize: '0.9rem',
    fontWeight: 500,
    letterSpacing: 0.2,
    padding: '0 8px',
    color: theme.palette.primary.contrastText,
  });

  const PlayerButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    borderRadius: '10px',
    padding: '6px 6px',
    '&:hover': {
      backgroundColor: theme.palette.grey[700],
    }
  }));

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <Box
        sx={(theme) => ({ backgroundColor: theme.palette.common.black, height: '100vh', display: "grid" })}
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
          <Grid item xs={12} sm={10} md={8}
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
              url="https://player.vimeo.com/video/851579304?h=79552e35bc&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
              playing={playing}
              controls={false}
              playsinline={true}
              width={'100%'}
              height={'auto'}
              style={{ borderRadius: 20, overflow: 'hidden', opacity: playing ? 1 : 0.7 }}
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
                    playsinline: true,
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
        <Fade in={mouseMoving || playing || !!!playing} timeout={1000}>
          <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
              gridArea: "1/1",
            }}
          >
            <Grid item xs={12} sm={10} md={8} sx={{
              gridArea: "1/1",
              position: "relative",
              // This centers the other elements inside the hero component
              placeItems: "center",
              display: "grid",
            }}>

              <Box sx={{ width: '100%', padding: '56.25% 0 0 0', position: 'relative', mb: '10%' }}>
                <div style={{
                  padding: 7,
                  borderRadius: 16,
                  zIndex: 1,
                  backgroundColor: theme.palette.grey[900],
                  backdropFilter: 'blur(40px)',
                  position: 'absolute', top: '15%', left: 10
                }}>
                  <PlayerButton aria-label="close" size="small" onClick={handleClose} >
                    <CloseIcon fontSize="inherit" />
                  </PlayerButton>
                </div>

                <div style={{
                  padding: 7,
                  borderRadius: 16,
                  zIndex: 1,
                  backgroundColor: theme.palette.grey[900],
                  backdropFilter: 'blur(40px)',
                  position: 'absolute', top: '15%', right: 10
                }}>
                  <PlayerButton aria-label="transcript" size="small">
                    <ArticleIcon fontSize="inherit" />
                  </PlayerButton>
                  <PlayerButton aria-label="subitles" size="small">
                    <SubtitlesIcon fontSize="inherit" />
                  </PlayerButton>
                </div>


                <div style={{
                  padding: 8,
                  borderRadius: 16,
                  width: '80%',
                  maxWidth: '100%',
                  margin: 'auto',
                  position: 'relative',
                  zIndex: 1,
                  backgroundColor: theme.palette.grey[900],
                  backdropFilter: 'blur(40px)',
                }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlayerButton onClick={handlePlayPause}>
                      {playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </PlayerButton>
                    <PlayerButton onClick={handleRewind10Seconds}>
                      <Replay10Icon />
                    </PlayerButton>
                    <PlayerButton onClick={handleFastForward10Seconds}>
                      <Forward10Icon />
                    </PlayerButton>
                    <Fade in={!seeking}>
                      <TinyText>
                        {formatTime(duration * played)}
                      </TinyText>
                    </Fade>
                    <Slider
                      aria-label="time-indicator"
                      size="small"
                      value={played}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(_, value) => handleSeekChange(value)}
                      onChangeCommitted={(_, value) => handleSeekMouseUp(value)}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => formatTime(duration * value)}
                      sx={{
                        color: '#cf003d',
                        mx: 1,
                        height: 4,
                        '&:hover': {
                          '& .MuiSlider-thumb': {
                            height: 13,
                            width: 13,
                          },
                        },
                        '& .MuiSlider-thumb': {
                          width: 8,
                          height: 8,
                          '&:before': {
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                          },
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                              ? 'rgb(255 255 255 / 16%)'
                              : 'rgb(0 0 0 / 16%)'
                              }`,
                          },
                          '&.Mui-active': {
                            width: 15,
                            height: 15,
                          },
                        },
                        '& .MuiSlider-rail': {
                          opacity: 0.28,
                        },
                        '& .MuiSlider-valueLabel': {
                          '&:before': {
                            display: 'none',
                          },
                          backgroundColor: theme.palette.grey[900],
                          opacity: 0.8,
                          top: '-25px',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          letterSpacing: 0.2,
                          color: theme.palette.primary.contrastText,

                        },
                      }}
                    />

                    <Fade in={!seeking}>
                      <TinyText>
                        {formatTime(duration)}
                      </TinyText>
                    </Fade>
                    <PlayerButton onClick={handleToggleMuted}>
                      {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </PlayerButton>
                    <PlayerButton onClick={handleClickFullScreen}>
                      <FullscreenIcon />
                    </PlayerButton>

                  </Box>
                </div>
              </Box>

            </Grid>
          </Grid>
        </Fade>
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
          <Grid item xs={12} sm={10} md={8} sx={{
            gridArea: "1/1",
            position: "relative",
            // This centers the other elements inside the hero component
            placeItems: "center",
            display: "grid",
          }}>
            <Fade in={!playing}>
              <IconButton onClick={handlePlayPause}
                disableRipple
                sx={{ color: theme.palette.common.white, width: '100%', height: '100%', padding: '25% 0', cursor: 'default' }}>
                {playing ? <PauseIcon sx={{ fontSize: '4rem' }} /> : <PlayArrowIcon sx={{ fontSize: '6rem' }} />}
              </IconButton>
            </Fade>
            {!!playing &&
              <IconButton onClick={handlePlayPause}
                disableRipple
                sx={{ opacity: 0, position: 'absolute', color: theme.palette.common.white, width: '100%', height: '100%', padding: '25% 0', cursor: 'default' }}>
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