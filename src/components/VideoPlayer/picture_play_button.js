import * as React from "react"
import { useState } from "react";
import { Container, Grid, Typography, ButtonBase } from "@mui/material";
import VideoContainer from "./video_container"
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { styled } from '@mui/material/styles';

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

export default function PicturePlayButton({videoType, videoURL, imageBackgroundURL, buttonText}) {

  const [open, setOpen] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container sx={{ my: 5 }}>
      <VideoContainer open={open} handleClose={handleClose}
        // videoType="vimeo"
        // videoURL='https://player.vimeo.com/video/851579304?h=79552e35bc&badge=0&autopause=0&player_id=0&app_id=58479'
        videoType={videoType}
        videoURL={videoURL}
      />

      <Grid container direction="column"
        justifyContent="center"
        alignItems="stretch">
        <Grid item xs={12}>

          <ImageButton
            focusRipple
            onClick={handleClickOpen}
          >
            <ImageSrc style={{ backgroundImage: `url(${imageBackgroundURL})` }} />
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
                    {buttonText}
                  </span>
                </div>
              </Typography>
            </Image>
          </ImageButton>

        </Grid>
      </Grid>

    </Container>
  )

}