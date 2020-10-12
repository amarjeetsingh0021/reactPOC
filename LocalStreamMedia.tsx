// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
import { Image, ImageFit, Label, PrimaryButton } from '@fluentui/react';
import { LocalVideoStream, Renderer, RendererView } from '@azure/communication-calling';
import { videoHint, mediaContainer, localVideoContainerStyle, app, time, button } from './styles/StreamMedia.styles';
import { videoCameraIconStyle } from './styles/Configuration.styles';
import { Constants } from '../core/constants';
import staticMediaSVG from '../assets/staticmedia.svg';
import { PlayIcon, PauseThickIcon, SyncIcon } from '@fluentui/react-icons-northstar';

export interface LocalStreamMediaProps {
    label: string;
    stream: LocalVideoStream;
}

//let totalSeconds = 0;
////document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
//let hh = 0;
//let min = 0
//let sec = 0;

//const countTimer = () => {
//    ++totalSeconds;
//    var hour = Math.floor(totalSeconds / 3600);
//    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
//    var seconds = totalSeconds - (hour * 3600 + minute * 60);
//    if (hour < 10)
//        hour = 0 + hour;
//    if (minute < 10)
//        minute = 0 + minute;
//    if (seconds < 10)
//        seconds = 0 + seconds;
//    hh = hour;
//    min = minute;
//    sec = seconds;
//};

//setInterval(countTimer, 1000);


export default (props: LocalStreamMediaProps) : JSX.Element => {
    let rendererView: RendererView;

    const [available, setAvailable] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const imageProps = {
        src: staticMediaSVG.toString(),
        imageFit: ImageFit.contain,
        maximizeFrame: true
    };

    //var minutesLabel = document.getElementById("minutes");
    //var secondsLabel = document.getElementById("seconds");
    //var totalSeconds = 0;
    //setInterval(setTime, 1000);

    //function setTime() {
    //    ++totalSeconds;
    //    secondsLabel = pad(totalSeconds % 60);
    //    minutesLabel = pad(parseInt(totalSeconds / 60));
    //}

    //function pad(val:any) {
    //    var valString = val + "";
    //    if (valString.length < 2) {
    //        return "0" + valString;
    //    } else {
    //        return valString;
    //    }
    //}
    function toggle() {
        setIsActive(!isActive);
        console.log('hello');
    }

    function reset() {
        setSeconds(0);
        setIsActive(false);
    }

    useEffect(() => {
        (async () => {
            if (props.stream) {
                var renderer: Renderer = new Renderer(props.stream);
                rendererView = await renderer.createView({ scalingMode: 'Crop' });

                var container = document.getElementById(Constants.LOCAL_VIDEO_PREVIEW_ID);

                if (container && container.childElementCount === 0) {
                    container.appendChild(rendererView.target);
                    setAvailable(true);
                }
            } else {
                if (rendererView) {
                    rendererView.dispose();
                    setAvailable(false);
                }
            }
        })();

        let interval: any;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
            //toggle();
            if (rendererView) {
                rendererView.dispose();
                setAvailable(false);
            }
        };
    }, [props.stream, isActive, seconds]);

    return (
        <div className={mediaContainer}>
            <div className={app}>
                <div className={time}>
                    Duration: {seconds}s
                </div>
                <div className="row">
                    <PrimaryButton className={button} onClick={toggle}>
                        {isActive ? <PauseThickIcon className={videoCameraIconStyle} size="medium" /> : <PlayIcon className={videoCameraIconStyle} size="medium" />}
                    </PrimaryButton>
                    <PrimaryButton className={button} onClick={reset}>
                        <SyncIcon className={videoCameraIconStyle} size="medium" />
                    </PrimaryButton>
                </div>
            </div>
            <div
                style={{ display: available ? 'block' : 'none' }}
                className={localVideoContainerStyle}
                id={Constants.LOCAL_VIDEO_PREVIEW_ID}
            />
            <Image style={{ display: available ? 'none' : 'block' }} {...imageProps} />
            <Label className={videoHint}>{props.label}</Label>
        </div>
    );
};
