import React, { useState } from "react";
import {
    Grid,
    CircularProgress,
    Typography,
    Button,
    Tabs,
    Tab,
    TextField,
    Fade,
    Snackbar
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { withRouter, useParams } from "react-router-dom";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";
import google from "../../images/google.svg";

// context
import { useUserDispatch, forgotPassword, recoverPassword } from "../../context/UserContext";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ForgotPassword(props) {
    var classes = useStyles();

    // page params
    const params = useParams();
    const { email, token } = params;
    let show_recover = false;
    if(email && token) show_recover = true;

    // global
    const userDispatch = useUserDispatch();

    // local
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTabId, setActiveTabId] = useState(show_recover ? 1 : 0);
    const [loginValue, setLoginValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [passwordConfirmationValue, setPasswordConfirmationValue] = useState("");
    const [showAlert, setAlert] = React.useState("");


    const handleForgotPassword = (e) => {
        e.preventDefault()
        forgotPassword(
            loginValue,
            setAlert,
            setIsLoading,
            setError
        )
    }

    const handleChangePassword = (e) => {
        e.preventDefault()
        recoverPassword(
            email,
            token,
            passwordValue,
            passwordConfirmationValue,
            props.history,
            setIsLoading,
            setError,
        )
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlert('');
    };

    return (
        <Grid container className={classes.container}>
            <div className={classes.logotypeContainer}>
                <img src={logo} alt="logo" className={classes.logotypeImage} />
                <Typography className={classes.logotypeText}>Material Admin</Typography>
            </div>
            <div className={classes.formContainer}>
                <div className={classes.form}>
                    <Tabs
                        value={activeTabId}
                        onChange={(e, id) => setActiveTabId(id)}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        scrollButtons="auto"
                    >
                        <Tab label="Forgot" classes={{ root: classes.tab }} />
                        <Tab label="Recover" classes={{ root: classes.tab }} />
                    </Tabs>
                    {activeTabId === 0 && (
                        <React.Fragment>
                            <Typography variant="h1" className={classes.greeting}>
                                Forgot Password!
                            </Typography>
                            <Fade in={!!error}>
                                <Typography color="secondary" className={classes.errorMessage}>
                                    {error}
                                </Typography>
                            </Fade>
                            <TextField
                                id="email"
                                InputProps={{
                                    classes: {
                                        underline: classes.textFieldUnderline,
                                        input: classes.textField,
                                    },
                                }}
                                value={loginValue}
                                onChange={e => setLoginValue(e.target.value)}
                                margin="normal"
                                placeholder="Email Adress"
                                type="email"
                                fullWidth
                            />
                            <div className={classes.creatingButtonContainer}>
                                {isLoading ? (
                                    <CircularProgress size={26} />
                                ) : (
                                    <Button
                                        onClick={handleForgotPassword}
                                        disabled={
                                            loginValue.length === 0
                                        }
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        className={classes.createAccountButton}
                                    >
                                        Send
                                    </Button>
                                )}
                            </div>
                        </React.Fragment>
                    )}
                    {activeTabId === 1 && (
                        <React.Fragment>
                            <Typography variant="h1" className={classes.greeting}>
                                Recover password!
                            </Typography>
                            <Fade in={!!error}>
                                <Typography color="secondary" className={classes.errorMessage}>
                                    {error}
                                </Typography>
                            </Fade>
                            <form onSubmit={handleChangePassword}>
                                <TextField
                                    id="password"
                                    InputProps={{
                                        classes: {
                                            underline: classes.textFieldUnderline,
                                            input: classes.textField,
                                        },
                                    }}
                                    value={passwordValue}
                                    onChange={e => setPasswordValue(e.target.value)}
                                    margin="normal"
                                    placeholder="New password"
                                    type="password"
                                    fullWidth
                                />
                                <TextField
                                    id="confirm_password"
                                    InputProps={{
                                        classes: {
                                            underline: classes.textFieldUnderline,
                                            input: classes.textField,
                                        },
                                    }}
                                    value={passwordConfirmationValue}
                                    onChange={e => setPasswordConfirmationValue(e.target.value)}
                                    margin="normal"
                                    placeholder="Confirm password"
                                    type="password"
                                    fullWidth
                                />
                                <div className={classes.creatingButtonContainer}>
                                    {isLoading ? (
                                        <CircularProgress size={26} />
                                    ) : (
                                        <Button
                                            disabled={
                                                passwordValue.length === 0 ||
                                                passwordConfirmationValue.length === 0
                                            }
                                            type="submit"
                                            size="large"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            className={classes.createAccountButton}
                                        >
                                            Reset your password
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </React.Fragment>
                    )}
                </div>
                <Snackbar open={!!showAlert} autoHideDuration={4000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        {showAlert}
                    </Alert>
                </Snackbar>
                <Typography color="primary" className={classes.copyright}>
                    © 2020-2021 Rubén Carvajal.
                </Typography>
            </div>
        </Grid>
    );
}

export default withRouter(ForgotPassword);
