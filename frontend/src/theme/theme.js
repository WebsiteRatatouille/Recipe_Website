import { createTheme } from "@mui/material/styles";
import "../variables.css";

const theme = createTheme({
    palette: {
        primary: {
            main: "#795548", // nâu đậm
        },
        secondary: {
            main: "#d2b48c", // nâu nhạt
        },
        background: {
            default: "#f5f5f5", // nền chung
            paper: "#ffffff", // nền các box, paper
        },
        text: {
            primary: "#212121",
            secondary: "#757575",
        },
    },
});
