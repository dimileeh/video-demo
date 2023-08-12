import * as React from "react"
import { useState } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import { styled } from '@mui/material/styles';

const PlayerSlider = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  boxSizing: 'content-box',
  display: 'inline-block',
  position: 'relative',
  cursor: 'pointer',
  touchAction: 'none',
  WebkitTapHighlightColor: 'transparent',
  padding: '13px 0',
  color: '#cf003d',
  marginLeft: '8px',
  marginRight: '8px',
  height: '4px',
  width: '94%',
}));

const SliderRail = styled(Box)(({ theme }) => ({
  opacity: 0.28,
  display: 'block',
  position: 'absolute',
  borderRadius: 'inherit',
  backgroundColor: 'currentColor',
  width: '100%',
  height: 'inherit',
  top: '50%',
  transform: 'translateY(-50%)',
}));


const SliderTrack = styled(Box)(({ theme }) => ({
  left: '0%',
  width: '99.9301%',
  display: 'block',
  position: 'absolute',
  borderRadius: 'inherit',
  border: 'none',
  backgroundColor: 'currentColor',
  transition: 'left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,width 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,bottom 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,height 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  height: 'inherit',
  top: '50%',
  transform: 'translateY(-50%)',
}));

const SliderLoading = styled(Box)(({ theme }) => ({
  opacity: 0.4,
  left: '0%',
  display: 'block',
  position: 'absolute',
  borderRadius: 'inherit',
  border: 'none',
  backgroundColor: 'currentColor',
  transition: 'left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,width 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,bottom 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,height 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  height: 'inherit',
  top: '50%',
  transform: 'translateY(-50%)',
}));

const SliderThumb = styled(Box)(({ theme }) => ({
  width: '8px',
  height: '8px',
  position: 'absolute',
  boxSizing: 'border-box',
  borderRadius: '50%',
  outline: 0,
  backgroundColor: 'currentColor',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,bottom 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  '&:hover': {
    width: '13px',
    height: '13px',
    boxShadow: '0px 0px 0px 8px rgb(255 255 255 / 16%)',
  },
  '&:before': {
    position: 'absolute',
    content: '""',
    borderRadius: 'inherit',
    width: '100%',
    height: '100%',
    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
  },
  '&:after': {
    position: 'absolute',
    content: '""',
    borderRadius: '50%',
    width: '42px',
    height: '42px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
}));


const SliderThumbButton = styled('input')(({ theme }) => ({
  border: 0,
  clip: 'rect(0px, 0px, 0px, 0px)',
  height: '100%',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '100%',
  direction: 'ltr',
}));


// a video progress bar component
function VideoProgressBar(props) {
  const { played, loaded, handleSeekChange, handleSeekMouseUp } = props;

  const [value, setValue] = useState(played);
  const [mouseMove, setMouseMove] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const onTrackDown = (e) => {
    setMouseDown(true)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (x >= 0 && x <= 1) {
      handleSeekChange(x)
      setValue(x)
    }
  }

  const onTrackUp = (e) => {
    handleSeekMouseUp(value)
    setMouseDown(false)
  }

  const onTrackMove = (e) => {
    setMouseMove(true)
    if (e.buttons === 1 || e.type === 'touchmove') {
      const rect = e.currentTarget.getBoundingClientRect();
      let clientX = e.touches? e.touches[0].clientX : e.clientX;
      const x = (clientX - rect.left) / rect.width;
      if (x >= 0 && x <= 1) {
        handleSeekChange(x)
        setValue(x)
      }
    }
  }

  return (
    <PlayerSlider id="playerSlider" component='span'
      onMouseDown={onTrackDown}
      onTouchStart={onTrackDown}
      onMouseMove={onTrackMove}
      onTouchMove={onTrackMove}
      onMouseUp={onTrackUp}
      onTouchEnd={onTrackUp}
      onMouseLeave={() => setMouseMove(false)}
    >
      <SliderRail component='span' />
      <SliderLoading component='span' sx={{ width: `${loaded * 100}%` }} />
      <SliderTrack id="sliderTrack" component='span' sx={{ width: `${played * 100}%` }} />
      <SliderThumb component='span' sx={{
        left: `${played * 100}%`, width: mouseMove ? (mouseDown ? '15px !important' : '13px') : '8px',
        height: mouseMove ? (mouseDown ? '15px !important' : '13px') : '8px'
      }}>
        <SliderThumbButton type="range" defaultValue={played} margin="none" min="0" max="1" step="0.01"
          data-index="0" aria-label="time-indicator" aria-valuenow={played}
          aria-orientation="horizontal" aria-valuemax="1" aria-valuemin="0"
        />
      </SliderThumb>
    </PlayerSlider>
  );
}


export { VideoProgressBar }