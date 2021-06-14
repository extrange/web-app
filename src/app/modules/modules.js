// /*Add new modules here*/
// import {Lists} from "../modules/Lists/Lists";
// import {Literature} from "../modules/Literature/Literature";
// import {Account} from "../modules/Account/Account";
// import {HomeAutomation} from "../modules/HomeAutomation/HomeAutomation";
// import {DVR} from "../modules/Dvr/DVR";
// import {OptionHedgeCalculator} from "../modules/OptionHedgeCalculator/OptionHedgeCalculator";
import {Testing} from "../../modules/Testing/Testing";
import {PasswordTools} from "../../modules/PasswordTools/PasswordTools";

export const MODULES = {
    // LISTS: {
    //     displayName: 'Lists',
    //     onlySuperUser: false,
    //     jsx: <Lists/>
    // },
    // LITERATURE: {
    //     displayName: 'Literature',
    //     onlySuperUser: false,
    //     jsx: <Literature/>
    // },
    // ACCOUNT: {
    //     displayName: 'Account',
    //     onlySuperUser: false,
    //     jsx: <Account/>
    // },
    PASSWORDS: {
        displayName: 'Password Tools',
        onlySuperUser: false,
        jsx: <PasswordTools/>
    },
    // HOME_AUTOMATION: {
    //     displayName: 'Home Automation',
    //     onlySuperUser: true,
    //     jsx: <HomeAutomation/>
    // },
    // DVR: {
    //     displayName: 'DVR',
    //     onlySuperUser: true,
    //     jsx: <DVR/>
    // },
    // OPTION_HEDGE_CALCULATOR: {
    //     displayName: 'Option Hedge Calculator',
    //     onlySuperUser: false,
    //     jsx: <OptionHedgeCalculator/>
    // },
    TEST: {
        displayName: 'Testing',
        onlySuperUser: true,
        jsx: <Testing/>
    }
}