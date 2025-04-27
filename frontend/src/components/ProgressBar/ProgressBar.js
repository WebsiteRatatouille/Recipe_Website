import React from "react";
import "./ProgressBar.css";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    startProgress,
    stopProgress,
} from "../../utils/NProgress/NProgress";

const ProgressBar = () => {
    const location = useLocation();

    useEffect(() => {
        startProgress();
        const timer = setTimeout(() => {
            stopProgress();
        }, 500); // Đảm bảo progress dừng sau 500ms

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return null;
};

export default ProgressBar;
