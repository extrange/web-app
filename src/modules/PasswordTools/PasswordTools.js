import {AppBar} from "../../app/app-bar/AppBar";
import {useCallback, useEffect, useState} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    Slider,
    Snackbar,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import {
    formatLargeDuration,
    generatePassword,
    generateUsername,
    getEntropy,
    getSha1Hash
} from "./passwordUtil";
import {HIBP_LOOKUP} from "./urls";
import styled from 'styled-components'
import {BACKGROUND_COLOR} from "../../shared/components/backgroundScreen";
import ReplayIcon from '@material-ui/icons/Replay';
import "@fontsource/jetbrains-mono"
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {Alert} from "@material-ui/lab";
import {debounce} from 'lodash'
import SettingsIcon from '@material-ui/icons/Settings';
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import {send} from "../../app/appSlice";

const Container = styled.div`
  display: flex;
  max-width: 600px;
  flex-direction: column;
  padding: 10px;
  ${BACKGROUND_COLOR};
`;

const StyledTextField = styled(TextField)`
  .MuiInputBase-input {
    font-family: "JetBrains Mono", monospace
  }

  margin: 10px 0;
`;

const TextFieldContainer = styled.div`
  display: flex;
  align-items: flex-start;
`;

const StyledIconButton = styled(IconButton)`
  margin-top: 14px;
`;

const OptionsFormGroup = styled(FormGroup)`
  display: flex;
  flex-direction: column;
`;

const PasswordDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: start;
  gap: 10px 10px;
  align-items: center;
  margin: 5px 0 15px;
`;

const GreenCheck = styled(CheckIcon)`
  color: chartreuse;
  margin-right: 10px;
`;

const GreyCross = styled(ClearIcon)`
  color: grey;
  margin-right: 10px;
`;


const formatNumber = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0});
const formatDecimal = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2});

const DEFAULT_USERNAME_LENGTH = 10;
const DEFAULT_PASSWORD_LENGTH = 24;

export const PasswordTools = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [hashCount, setHashCount] = useState(0);
    const [settings, setSettings] = useState({
        dialogOpen: false,
        dialogType: null,
        passwordSettings: {
            length: DEFAULT_PASSWORD_LENGTH,
            digits: true,
            lower: true,
            upper: true,
            symbols: true
        },
        usernameSettings: {
            length: DEFAULT_USERNAME_LENGTH
        }
    });

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [entropy, setEntropy] = useState({});

    let secondsToBruteforce = (2 ** entropy.totalEntropy / (200 * 10 ** 18));

    useEffect(() => {
        if (!password) return;

        let generatedPassword = generatePassword(settings.passwordSettings);
        setPassword(generatedPassword);
        setEntropy(getEntropy(generatedPassword))
        // eslint-disable-next-line
    }, [settings.passwordSettings]);

    useEffect(() => {
        setUsername(generateUsername(settings.usernameSettings))
    }, [settings.usernameSettings]);

    // eslint-disable-next-line
    const checkHibp = useCallback(debounce(
        hash => getSha1Hash(hash)
            .then(r => send(HIBP_LOOKUP(r)))
            .then(r => r.json())
            .then(r => {
                setHashCount(r.count);
                setLoading(false)
            })
        , 500)
        , []);

    const copyToClipboard = text => navigator.clipboard.writeText(text)
        .then(() => {
            if (snackbarOpen) {
                setSnackbarOpen(false);
                setTimeout(() => setSnackbarOpen(true), 100)
            } else
                setSnackbarOpen(true);
        });

    const onPasswordChange = text => {
        setLoading(true);
        setPassword(text);
        checkHibp(text);
        setEntropy(getEntropy(text))
    };

    const closeSettings = () => setSettings(current => ({...current, dialogOpen: false}));

    return <AppBar
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}>

        <Dialog open={settings.dialogOpen} onClose={closeSettings}>
            <DialogTitle
                style={{zIndex: 1}}>{settings.dialogType === 'username' ? 'Username' : 'Password'} Options</DialogTitle>
            <DialogContent>
                {settings.dialogType === 'username' && <>
                    Length: {settings.usernameSettings.length}
                    <Slider value={settings.usernameSettings.length}
                            step={1}
                            min={6}
                            max={24}
                            onChange={(e, value) =>
                                setSettings(current => ({
                                    ...current,
                                    usernameSettings: {
                                        length: value
                                    }
                                }))}/>
                </>}
                {settings.dialogType === 'password' && <>
                    Length: {settings.passwordSettings.length}
                    <Slider value={settings.passwordSettings.length}
                            step={1}
                            min={6}
                            max={64}
                            onChange={(e, value) =>
                                setSettings(current => ({
                                    ...current,
                                    passwordSettings: {
                                        ...current.passwordSettings,
                                        length: value
                                    }
                                }))}/>
                    <FormControl>
                        <OptionsFormGroup>
                            <FormControlLabel control={<Checkbox checked={settings.passwordSettings.lower}
                                                                 onChange={e => setSettings(current => ({
                                                                     ...current,
                                                                     passwordSettings: {
                                                                         ...current.passwordSettings,
                                                                         lower: e.target.checked
                                                                     }
                                                                 }))}/>}
                                              label={'a-z'}/>
                            <FormControlLabel control={<Checkbox checked={settings.passwordSettings.upper}
                                                                 onChange={e => setSettings(current => ({
                                                                     ...current,
                                                                     passwordSettings: {
                                                                         ...current.passwordSettings,
                                                                         upper: e.target.checked
                                                                     }
                                                                 }))}/>}
                                              label={'A-Z'}/>
                            <FormControlLabel control={<Checkbox checked={settings.passwordSettings.digits}
                                                                 onChange={e => setSettings(current => ({
                                                                     ...current,
                                                                     passwordSettings: {
                                                                         ...current.passwordSettings,
                                                                         digits: e.target.checked
                                                                     }
                                                                 }))}/>}
                                              label={'0-9'}/>
                            <FormControlLabel control={<Checkbox checked={settings.passwordSettings.symbols}
                                                                 onChange={e => setSettings(current => ({
                                                                     ...current,
                                                                     passwordSettings: {
                                                                         ...current.passwordSettings,
                                                                         symbols: e.target.checked
                                                                     }
                                                                 }))}/>}
                                              label={'!@#$%^&*'}/>
                        </OptionsFormGroup>
                    </FormControl>
                </>}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeSettings}>Close</Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}>
            <Alert severity="success" variant={'filled'}>Copied</Alert>
        </Snackbar>
        <Container>
            <TextFieldContainer>
                <StyledTextField
                    variant={'outlined'}
                    label={'Random Username'}
                    value={username}
                    fullWidth
                    onChange={e => setUsername(e.target.value)}
                    InputProps={{
                        endAdornment:
                            <>
                                <IconButton onClick={() => copyToClipboard(username)}>
                                    <FileCopyIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={() => setUsername(generateUsername(settings.usernameSettings))}>
                                    <ReplayIcon/>
                                </IconButton>
                            </>
                    }}
                />
                <StyledIconButton onClick={() => setSettings(current => ({
                    ...current,
                    dialogOpen: true,
                    dialogType: 'username'
                }))}><SettingsIcon/></StyledIconButton>
            </TextFieldContainer>
            <TextFieldContainer>
                <StyledTextField
                    variant={'outlined'}
                    label={'Type a password'}
                    value={password}
                    fullWidth
                    error={!loading && Boolean(hashCount)}
                    helperText={loading ? 'Checking...' :
                        password === '' ? 'Type a password to check, or generate one' :
                            hashCount > 0 ? `Password cracked ${formatNumber.format(hashCount)} times` :
                                'Password has not been cracked'}
                    onChange={e => onPasswordChange(e.target.value)}
                    InputProps={{
                        endAdornment:
                            <>
                                <IconButton onClick={() => copyToClipboard(password)}>
                                    <FileCopyIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={() => onPasswordChange(generatePassword(settings.passwordSettings))}>
                                    <ReplayIcon/>
                                </IconButton>
                            </>
                    }}
                />
                <StyledIconButton onClick={() => setSettings(current => ({
                    ...current,
                    dialogOpen: true,
                    dialogType: 'password'
                }))}><SettingsIcon/></StyledIconButton>
            </TextFieldContainer>
            <PasswordDetailGrid>
                <Typography variant={'body1'} color={entropy.hasLowerCase ? 'textPrimary' : 'textSecondary'}>Lowercase
                    letters </Typography>
                {entropy.hasLowerCase ? <GreenCheck/> : <GreyCross/>}

                <Typography variant={'body1'} color={entropy.hasUpperCase ? 'textPrimary' : 'textSecondary'}>Uppercase
                    letters</Typography>
                {entropy.hasUpperCase ? <GreenCheck/> : <GreyCross/>}

                <Typography variant={'body1'}
                            color={entropy.hasDigits ? 'textPrimary' : 'textSecondary'}>Digits</Typography>
                {entropy.hasDigits ? <GreenCheck/> : <GreyCross/>}

                <Typography variant={'body1'} color={entropy.hasSymbols ? 'textPrimary' : 'textSecondary'}>Symbols
                    (@#...)</Typography>
                {entropy.hasSymbols ? <GreenCheck/> : <GreyCross/>}

                <Typography variant={'body1'}>Entropy
                    <Tooltip
                        arrow
                        enterTouchDelay={100}
                        interactive
                        title={'A measure of how secure the password is. 128 bits is recommended for most people.'}>
                        <IconButton tabIndex={-1}>
                            <InfoOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Typography variant={'body1'}>{entropy.totalEntropy && (formatDecimal.format(entropy.totalEntropy) + ' bits')}</Typography>

                <Typography variant={'body1'}>Time to crack
                    <Tooltip
                        arrow
                        enterTouchDelay={100}
                        interactive
                        title={'Based on the current Bitcoin hashrate (200 EH/s)'}>
                        <IconButton tabIndex={-1}>
                            <InfoOutlinedIcon/>
                        </IconButton>
                    </Tooltip>
                </Typography>
                <Typography variant={'body1'}>{Number.isFinite(secondsToBruteforce) && formatLargeDuration(secondsToBruteforce)}</Typography>
            </PasswordDetailGrid>


        </Container>
    </AppBar>


};