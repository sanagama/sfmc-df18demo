'use strict';

// Helper to log debug messages
export function logDebug(msg: any)
{
    let currentTime = new Date().toLocaleTimeString();
    let outputMsg = "[" + currentTime + "]: " + msg ? msg.toString() : "";
    console.log(outputMsg);
}