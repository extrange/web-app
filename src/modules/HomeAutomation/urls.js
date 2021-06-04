import {API_URL} from "../../app/urls";
import {Networking} from "../../app/network/networking";

const HOME_AUTOMATION_URL = `${API_URL}/home-automation/send`;

export const COMMANDS = {
    gate_toggle: 'Gate: Toggle',
    ac_off: 'AC: Off',
    ac_on_24: 'AC: On @ 24°C',
    ac_on_25: 'AC: On @ 25°C',
    ceiling_fan_on: 'Ceiling Fan: On',
    ceiling_fan_off: 'Ceiling Fan: Off',
    dyson_fan_on: 'Dyson Fan: On',
    dyson_fan_off: 'Dyson Fan: Off',
};

export const sendCommand = command => Networking.send(HOME_AUTOMATION_URL, {
    method: Networking.POST,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({command})
});