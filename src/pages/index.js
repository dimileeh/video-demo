import * as React from "react"
import { findDOMNode } from 'react-dom'
import { useState } from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

import { Grid, Box, Container, IconButton, ButtonBase, Button, Typography, Fade, Dialog, Paper, LinearProgress, Slider, Stack, Slide } from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import { styled, useTheme } from '@mui/material/styles';

import ReactPlayer from 'react-player/vimeo'
import screenfull from 'screenfull'
import { VideoCameraFront } from "@mui/icons-material"

const links = [
  {
    text: "Tutorial",
    url: "https://www.gatsbyjs.com/docs/tutorial",
    description:
      "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
  },
  {
    text: "Examples",
    url: "https://github.com/gatsbyjs/gatsby/tree/master/examples",
    description:
      "A collection of websites ranging from very basic to complex/complete that illustrate how to accomplish specific tasks within your Gatsby sites.",
  },
  {
    text: "Plugin Library",
    url: "https://www.gatsbyjs.com/plugins",
    description:
      "Learn how to add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.",
  },
  {
    text: "Build and Host",
    url: "https://www.gatsbyjs.com/cloud",
    description:
      "Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!",
  },
]

const samplePageLinks = [
  {
    text: "Page 2",
    url: "page-2",
    badge: false,
    description:
      "A simple example of linking to another page within a Gatsby site",
  },
  { text: "TypeScript", url: "using-typescript" },
  { text: "Server Side Rendering", url: "using-ssr" },
  { text: "Deferred Static Generation", url: "using-dsg" },
]

const moreLinks = [
  { text: "Join us on Discord", url: "https://gatsby.dev/discord" },
  {
    text: "Documentation",
    url: "https://gatsbyjs.com/docs/",
  },
  {
    text: "Starters",
    url: "https://gatsbyjs.com/starters/",
  },
  {
    text: "Showcase",
    url: "https://gatsbyjs.com/showcase/",
  },
  {
    text: "Contributing",
    url: "https://www.gatsbyjs.com/contributing/",
  },
  { text: "Issues", url: "https://github.com/gatsbyjs/gatsby/issues" },
]

const utmParameters = `?utm_source=starter&utm_medium=start-page&utm_campaign=default-starter`

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 400,
  width: '100%',
  '& .MuiTypography-root': {
    backgroundColor: theme.palette.grey[800],
    borderRadius: 50,
    color: theme.palette.common.white,
    transition: 'all 0.3s ease',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.grey[800],
    },
  },
}));

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
  borderRadius: 20,
});

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}));

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


const IndexPage = () => {

  const [open, setOpen] = useState(false);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    padding: '4px 8px',
    '&:hover': {
      backgroundColor: theme.palette.grey[700],
    }
  }));

  return (
    <Layout>
      <div className={styles.textCenter}>
        <StaticImage
          src="../images/example.png"
          loading="eager"
          width={64}
          quality={95}
          formats={["auto", "webp", "avif"]}
          alt=""
          style={{ marginBottom: `var(--space-3)` }}
        />
        <h1>
          Welcome to <b>Gatsby!</b>
        </h1>

        <Container sx={{ my: 5 }}>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <Box
              sx={(theme) => ({ backgroundColor: theme.palette.common.black, height: '100vh', display: "grid" })}
              onMouseMove={setMouseMove}
            >
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
                          playsinline: false,
                          byline: false,
                          color: 'cf003d'
                        }
                      },
                    }}
                  />

                </Grid>

              </Grid>

                    <Fade in={mouseMoving || !!!playing} timeout={1000}>
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
                      padding: 6,
                      borderRadius: 16,
                      zIndex: 1,
                      backgroundColor: theme.palette.grey[900],
                      backdropFilter: 'blur(40px)',
                      position: 'absolute', top: '15%', left: 10
                    }}>
                    <PlayerButton aria-label="close" onClick={handleClose} >
                      <CloseIcon fontSize="inherit" />
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
                      {playing ? <PauseIcon sx={{fontSize: '4rem'}} /> : <PlayArrowIcon sx={{ fontSize: '6rem' }} />}
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


            </Box>
          </Dialog>

          <Grid container direction="column"
            justifyContent="center"
            alignItems="stretch">
            <Grid item xs={12}>

              <ImageButton
                focusRipple
                onClick={handleClickOpen}
              >
                <ImageSrc style={{ backgroundImage: `url(https://images.unsplash.com/photo-1604975999044-188783d54fb3?w=2589)` }} />
                <Image>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="inherit"
                    sx={{
                      position: 'relative',
                      p: 4,
                      pt: 2,
                      pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}>
                      <PlayArrowIcon />
                      <span>
                        Play the Revolut 10 Film
                      </span>
                    </div>
                  </Typography>
                </Image>
              </ImageButton>

            </Grid>
          </Grid>

        </Container>
        <p className={styles.intro}>
          <b>Example pages:</b>{" "}
          {samplePageLinks.map((link, i) => (
            <React.Fragment key={link.url}>
              <Link to={link.url}>{link.text}</Link>
              {i !== samplePageLinks.length - 1 && <> · </>}
            </React.Fragment>
          ))}
          <br />
          Edit <code>src/pages/index.js</code> to update this page.
        </p>
      </div>
      <ul className={styles.list}>
        {links.map(link => (
          <li key={link.url} className={styles.listItem}>
            <a
              className={styles.listItemLink}
              href={`${link.url}${utmParameters}`}
            >
              {link.text} ↗
            </a>
            <p className={styles.listItemDescription}>{link.description}</p>
          </li>
        ))}
      </ul>
      {moreLinks.map((link, i) => (
        <React.Fragment key={link.url}>
          <a href={`${link.url}${utmParameters}`}>{link.text}</a>
          {i !== moreLinks.length - 1 && <> · </>}
        </React.Fragment>
      ))}
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
