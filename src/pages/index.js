import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"

import { Grid, Box, Container, IconButton, ButtonBase, Typography, Fade, Dialog, Paper } from "@mui/material"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

import ReactPlayer from 'react-player/vimeo'

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


const IndexPage = () => {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            >
              <IconButton aria-label="close" size="large" onClick={handleClose} sx={{ color: 'white', position: 'absolute', top: 10, left: 10 }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
                  <Grid container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
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
                    <ReactPlayer url="https://player.vimeo.com/video/851579304?h=79552e35bc&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                      playing={true}
                      controls={true}
                      width={'100%'}
                      height={'auto'}
                      style={{borderRadius: 20, overflow: 'hidden'}}
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

                      {/* <Typography sx={{color: 'white'}}>HELLO</Typography> */}

                    </Grid>

                  {/* <Grid item sx={{padding: '56.25% 0 0 0', position: 'relative'}}><iframe src="https://player.vimeo.com/video/851579304?h=79552e35bc&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Test Embedding"></iframe></Grid><script src="https://player.vimeo.com/api/player.js"></script>
*/}

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
