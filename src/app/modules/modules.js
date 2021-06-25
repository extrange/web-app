// /*Add new modules here*/
// import {Lists} from "../modules/Lists/Lists";
// import {Literature} from "../modules/Literature/Literature";
// import {Account} from "../modules/Account/Account";
// import {HomeAutomation} from "../modules/HomeAutomation/HomeAutomation";
// import {DVR} from "../modules/Dvr/DVR";
// import {OptionHedgeCalculator} from "../modules/OptionHedgeCalculator/OptionHedgeCalculator";
import {Testing} from "../../modules/Testing/Testing";
import {PasswordTools} from "../../modules/PasswordTools/PasswordTools";
import {HomeAutomation} from "../../modules/HomeAutomation/HomeAutomation";
import {OptionHedgeCalculator} from "../../modules/OptionHedgeCalculator/OptionHedgeCalculator";
import {Lists} from "../../modules/Lists/Lists";

export const MODULES = {
    LISTS: {
        menuName: 'Lists',
        onlySuperUser: false,
        element: Lists
    },
    // LITERATURE: {
    //     menuName: 'Literature',
    //     onlySuperUser: false,
    //     element: Literature
    // },
    // ACCOUNT: {
    //     menuName: 'Account',
    //     onlySuperUser: false,
    //     element: Account
    // },
    PASSWORDS: {
        menuName: 'Password Tools',
        onlySuperUser: false,
        element: PasswordTools,
    },
    HOME_AUTOMATION: {
        menuName: 'Home Automation',
        onlySuperUser: true,
        element: HomeAutomation
    },
    // DVR: {
    //     menuName: 'DVR',
    //     onlySuperUser: true,
    //     element: DVR
    // },
    OPTION_HEDGE_CALCULATOR: {
        menuName: 'Option Hedge Calculator',
        onlySuperUser: false,
        element: OptionHedgeCalculator
    },
    TEST: {
        menuName: 'Testing',
        onlySuperUser: true,
        element: Testing
    }
}