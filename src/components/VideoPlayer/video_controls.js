import * as React from "react"
import { styled, useTheme } from '@mui/material/styles';

import { Grid, Box, IconButton, Typography, Fade, Slider, Slide, Hidden } from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import ArticleIcon from '@mui/icons-material/Article';

import { useDeviceSelectors } from 'react-device-detect';
import useMediaQuery from '@mui/material/useMediaQuery';

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  const intSeconds = Math.floor(seconds % 60); // Truncate the fractional part

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(intSeconds).padStart(2, '0');

  return (hours > 0 ? String(hours).padStart(2, '0') + ':' : '') + paddedMinutes + ':' + paddedSeconds;
}

const PlayerButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  borderRadius: '10px',
  padding: '6px 6px',
  '&:hover': {
    backgroundColor: theme.palette.grey[700],
  }
}));

const TinyText = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  fontWeight: 500,
  letterSpacing: 0.2,
  padding: '0 8px',
  color: theme.palette.primary.contrastText,
}));

const VideoControls = ({
  duration, played, seeking, playing, muted, isFullScreen,
  mouseMoving, handlePlayPause, handleToggleMuted, handleClickFullScreen, handleClose,
  handleRewind10Seconds, handleFastForward10Seconds, handleSeekChange, handleSeekMouseUp,
  containerRef,
}) => {

  const theme = useTheme();


  const [selectors, data] = useDeviceSelectors(window.navigator.userAgent)
  const { isMobile } = selectors
  const isAtLeastMdScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [isMobileDevice, setIsMobileDevice] = React.useState(isMobile);

  React.useEffect(() => {
    setIsMobileDevice(isMobile || !isAtLeastMdScreen);
  }, [isMobile, isAtLeastMdScreen]);

  return (
    <Fade in={mouseMoving || !!!playing} timeout={1000}>
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
            height: isMobileDevice ? '100%' : 'auto',
          }}>

          <Box sx={{ width: '100%', padding: isMobileDevice ? 0 : '56.25% 0 0 0', position: 'relative', mb: isMobileDevice ? 0 : '10%',
          height: isMobileDevice ? '100%' : 'auto',
          maxWidth: !isMobileDevice ? 'calc(75vh * 16 / 9)' : 'auto',
          maxHeight: '100vh', }}>
            <div style={{
              padding: 7,
              borderRadius: 16,
              zIndex: 1,
              backgroundColor: theme.palette.grey[900],
              backdropFilter: 'blur(40px)',
              position: 'absolute', top: isMobileDevice ? 10 : '15%', left: 10,
              opacity: 0.9,
            }}>
              <PlayerButton aria-label="close" size="small" onClick={handleClose}>
                <CloseIcon fontSize="inherit" />
              </PlayerButton>
            </div>

            <div style={{
              padding: 7,
              borderRadius: 16,
              zIndex: 1,
              backgroundColor: theme.palette.grey[900],
              backdropFilter: 'blur(40px)',
              position: 'absolute', top: isMobileDevice ? 10 : '15%', right: 10,
              opacity: 0.9,
            }}>
              <PlayerButton aria-label="transcript" size="small">
                <ArticleIcon fontSize="inherit" />
              </PlayerButton>
              <PlayerButton aria-label="subitles" size="small">
                <SubtitlesIcon fontSize="inherit" />
              </PlayerButton>
            </div>


            <Slide direction="up" in={mouseMoving || !playing || !!isMobileDevice} container={containerRef}
              timeout={{ enter: 300, exit: 600 }}
              easing={{ enter: theme.transitions.easing.easeOut, exit: theme.transitions.easing.easeIn }}>

              <Grid item
                xs={12}
                md={isMobileDevice ? 12 : 10}
                sx={{
                  padding: isExtraSmallScreen ? 2 : 1,
                  borderRadius: isExtraSmallScreen ? 0 : 16,
                  width: '100%',
                  maxWidth: '100%',
                  margin: 'auto',
                  position: isMobileDevice ? 'absolute' : 'relative',
                  bottom: isMobileDevice ? (isExtraSmallScreen ? 0 : 10) : 'auto',
                  zIndex: 1,
                  backgroundColor: theme.palette.grey[900],
                  backdropFilter: 'blur(40px)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  opacity: 0.9,
                }}>
                <Box
                  sx={{
                    display: isExtraSmallScreen ? 'block' : 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Hidden smDown>
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
                  </Hidden>

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
                      width: '94%',
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
                  <Hidden smUp>
                  <Grid item
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: -2,
                      mb: isExtraSmallScreen ? 4 : 0,
                    }}
                  >
                    <TinyText sx={{fontSize: '0.8rem'}}>
                      {formatTime(duration * played)}
                    </TinyText>
                    <TinyText sx={{fontSize: '0.8rem'}}>
                        {formatTime(duration)}
                    </TinyText>
                  </Grid>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: -2,
                    }}
                  >
                    <PlayerButton onClick={handleToggleMuted}>
                      {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </PlayerButton>

                    <Box>

                    <PlayerButton onClick={handleRewind10Seconds}>
                      <Replay10Icon />
                    </PlayerButton>

                    <PlayerButton onClick={handlePlayPause}>
                      {playing ? <PauseIcon sx={{fontSize: '4rem'}}/> : <PlayArrowIcon sx={{fontSize: '4rem'}} />}
                    </PlayerButton>

                    <PlayerButton onClick={handleFastForward10Seconds}>
                      <Forward10Icon />
                    </PlayerButton>
                    </Box>

                    <PlayerButton onClick={handleClickFullScreen}>
                      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </PlayerButton>
                  </Box>
                  </Hidden>

                  <Hidden smDown>

                    <Fade in={!seeking}>
                      <TinyText>
                        {formatTime(duration)}
                      </TinyText>
                    </Fade>
                    <PlayerButton onClick={handleToggleMuted}>
                      {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </PlayerButton>
                    <PlayerButton onClick={handleClickFullScreen}>
                      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </PlayerButton>
                  </Hidden>

                </Box>
              </Grid>
            </Slide>
          </Box>

        </Grid>
      </Grid>
    </Fade>
  );
}

export default VideoControls;