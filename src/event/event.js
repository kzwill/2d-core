export var EventAction;
(function (EventAction) {
    EventAction[EventAction["Link"] = 0] = "Link";
    EventAction[EventAction["SetProps"] = 1] = "SetProps";
    EventAction[EventAction["StartAnimate"] = 2] = "StartAnimate";
    EventAction[EventAction["PauseAnimate"] = 3] = "PauseAnimate";
    EventAction[EventAction["StopAnimate"] = 4] = "StopAnimate";
    EventAction[EventAction["JS"] = 5] = "JS";
    EventAction[EventAction["GlobalFn"] = 6] = "GlobalFn";
    EventAction[EventAction["Emit"] = 7] = "Emit";
    EventAction[EventAction["StartVideo"] = 8] = "StartVideo";
    EventAction[EventAction["PauseVideo"] = 9] = "PauseVideo";
    EventAction[EventAction["StopVideo"] = 10] = "StopVideo";
    EventAction[EventAction["SendPropData"] = 11] = "SendPropData";
    EventAction[EventAction["SendVarData"] = 12] = "SendVarData";
    EventAction[EventAction["Navigator"] = 13] = "Navigator";
    EventAction[EventAction["Dialog"] = 14] = "Dialog";
    EventAction[EventAction["SendData"] = 15] = "SendData";
    EventAction[EventAction["PostMessage"] = 16] = "PostMessage";
    EventAction[EventAction["PostMessageToParent"] = 17] = "PostMessageToParent";
})(EventAction || (EventAction = {}));
//# sourceMappingURL=event.js.map