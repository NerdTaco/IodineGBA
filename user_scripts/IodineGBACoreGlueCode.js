"use strict";
/*
 Copyright (C) 2012-2015 Grant Galitz
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var IodineGUI = {
    Iodine:null,
    Blitter:null,
    timerID: null,
    startTime:(+(new Date()).getTime()) >>> 0,
    mixerInput:null,
    defaults:{
        sound:true,
        volume:1,
        skipBoot:false,
        toggleSmoothScaling:true,
        toggleDynamicSpeed:false,
        keyZones:[
            //Use this to control the key mapping:
            //A:
            [88, 74],
            //B:
            [90, 81, 89],
            //Select:
            [16],
            //Start:
            [13],
            //Right:
            [39],
            //Left:
            [37],
            //Up:
            [38],
            //Down:
            [40],
            //R:
            [50],
            //L:
            [49]
        ]
    }
};
window.onload = function () {
    //Initialize Iodine:
    registerIodineHandler();
    //Load BIOS
    IodineGUI.Iodine.attachBIOS(new Uint8Array(base64ToArray("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")));
    //Initialize the timer:
    registerTimerHandler();
    //Initialize the graphics:
    registerBlitterHandler();
    //Initialize the audio:
    registerAudioHandler();
    //Register the save handler callbacks:
    registerSaveHandlers();
    //Register the GUI controls.
    registerGUIEvents();
    //Register GUI settings.
    registerGUISettings();
}
function registerIodineHandler() {
    try {
        //Will run like shit if missing some of this for the webworker copy:
        if (!window.SharedArrayBuffer || !Atomics) {
            throw null;
        }
        //Try starting Iodine in a webworker:
        IodineGUI.Iodine = new IodineGBAWorkerShim();
        addEvent("beforeunload", window, registerBeforeUnloadHandler);
    }
    catch (e) {
        //Otherwise just run on-thread:
        IodineGUI.Iodine = new GameBoyAdvanceEmulator();
    }
}
function registerBeforeUnloadHandler(e) {
    IodineGUI.Iodine.pause();
    document.getElementById("pause").style.display = "none";
    document.getElementById("play").style.display = "inline";
    if (e.preventDefault) {
        e.preventDefault();
    }
    removeEvent("beforeunload", window, registerBeforeUnloadHandler);
    return "IodineGBA needs to process your save data, leaving now may result in not saving current data.";
}
function registerTimerHandler() {
    var rate = 16;
    IodineGUI.Iodine.setIntervalRate(rate | 0);
    setInterval(function () {
        //Check to see if web view is not hidden, if hidden don't run due to JS timers being inaccurate on page hide:
        if (!document.hidden && !document.msHidden && !document.mozHidden && !document.webkitHidden) {
            if (document.getElementById("play").style.display == "none") {
                IodineGUI.Iodine.play();
            }
            IodineGUI.Iodine.timerCallback((((+(new Date()).getTime()) >>> 0) - (IodineGUI.startTime >>> 0)) >>> 0);
        }
        else {
            IodineGUI.Iodine.pause();
        }
    }, rate | 0);
}
function registerBlitterHandler() {
    IodineGUI.Blitter = new GlueCodeGfx(240, 160);
    IodineGUI.Blitter.attachCanvas(document.getElementById("emulator_target"));
    IodineGUI.Iodine.attachGraphicsFrameHandler(IodineGUI.Blitter);
}
function registerAudioHandler() {
    var Mixer = new GlueCodeMixer();
    IodineGUI.mixerInput = new GlueCodeMixerInput(Mixer);
    IodineGUI.Iodine.attachAudioHandler(IodineGUI.mixerInput);
}
function registerGUIEvents() {
    addEvent("keydown", document, keyDown);
    addEvent("keyup", document, keyUpPreprocess);
    addEvent("change", document.getElementById("rom_load"), fileLoadROM);
    addEvent("change", document.getElementById("bios_load"), fileLoadBIOS);
    addEvent("click", document.getElementById("play"), function (e) {
        IodineGUI.Iodine.play();
        this.style.display = "none";
        document.getElementById("pause").style.display = "inline";
        if (e.preventDefault) {
             e.preventDefault();
        }
    });
    addEvent("click", document.getElementById("pause"), function (e) {
        IodineGUI.Iodine.pause();
        this.style.display = "none";
        document.getElementById("play").style.display = "inline";
        if (e.preventDefault) {
             e.preventDefault();
        }
    });
    addEvent("click", document.getElementById("restart"), function (e) {
        IodineGUI.Iodine.restart();
        if (e.preventDefault) {
             e.preventDefault();
        }
    });
    addEvent("click", document.getElementById("sound"), function () {
        if (this.checked) {
            IodineGUI.Iodine.enableAudio();
        }
        else {
            IodineGUI.Iodine.disableAudio();
        }
    });
    addEvent("click", document.getElementById("skip_boot"), function () {
             IodineGUI.Iodine.toggleSkipBootROM(this.checked);
    });
    addEvent("click", document.getElementById("toggleSmoothScaling"), function () {
             if (IodineGUI.Blitter) {
                IodineGUI.Blitter.setSmoothScaling(this.checked);
             }
    });
    addEvent("click", document.getElementById("toggleDynamicSpeed"), function () {
             IodineGUI.Iodine.toggleDynamicSpeed(this.checked);
    });
    addEvent("change", document.getElementById("import"), function (e) {
             if (typeof this.files != "undefined") {
                try {
                    if (this.files.length >= 1) {
                        writeRedTemporaryText("Reading the local file \"" + this.files[0].name + "\" for importing.");
                        try {
                            //Gecko 1.9.2+ (Standard Method)
                            var binaryHandle = new FileReader();
                            binaryHandle.onload = function () {
                                if (this.readyState == 2) {
                                    writeRedTemporaryText("file imported.");
                                    try {
                                        import_save(this.result);
                                    }
                                    catch (error) {
                                        writeRedTemporaryText(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                                    }
                                }
                                else {
                                    writeRedTemporaryText("importing file, please wait...");
                                }
                            }
                            binaryHandle.readAsBinaryString(this.files[this.files.length - 1]);
                        }
                        catch (error) {
                            //Gecko 1.9.0, 1.9.1 (Non-Standard Method)
                            var romImageString = this.files[this.files.length - 1].getAsBinary();
                            try {
                                import_save(romImageString);
                            }
                            catch (error) {
                                writeRedTemporaryText(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
                            }
                        }
                    }
                    else {
                        writeRedTemporaryText("Incorrect number of files selected for local loading.");
                    }
                }
                catch (error) {
                    writeRedTemporaryText("Could not load in a locally stored ROM file.");
                }
             }
             else {
                writeRedTemporaryText("could not find the handle on the file to open.");
             }
             if (e.preventDefault) {
                e.preventDefault();
             }
    });
    addEvent("click", document.getElementById("export"), refreshStorageListing);
    addEvent("unload", window, ExportSave);
    IodineGUI.Iodine.attachSpeedHandler(function (speed) {
        var speedDOM = document.getElementById("speed");
        speedDOM.textContent = "Speed: " + speed.toFixed(2) + "%";
    });
    addEvent("change", document.getElementById("volume"), volChangeFunc);
    addEvent("input", document.getElementById("volume"), volChangeFunc);
}
function registerGUISettings() {
    document.getElementById("sound").checked = IodineGUI.defaults.sound;
    if (IodineGUI.defaults.sound) {
        IodineGUI.Iodine.enableAudio();
    }
    try {
        var volControl = document.getElementById("volume");
        volControl.min = 0;
        volControl.max = 100;
        volControl.step = 1;
        volControl.value = IodineGUI.defaults.volume * 100;
    }
    catch (e) {}
    IodineGUI.mixerInput.setVolume(IodineGUI.defaults.volume);
    document.getElementById("skip_boot").checked = IodineGUI.defaults.skipBoot;
    IodineGUI.Iodine.toggleSkipBootROM(IodineGUI.defaults.skipBoot);
    document.getElementById("toggleSmoothScaling").checked = IodineGUI.defaults.toggleSmoothScaling;
    IodineGUI.Blitter.setSmoothScaling(IodineGUI.defaults.toggleSmoothScaling);
    document.getElementById("toggleDynamicSpeed").checked = IodineGUI.defaults.toggleDynamicSpeed;
    IodineGUI.Iodine.toggleDynamicSpeed(IodineGUI.defaults.toggleDynamicSpeed);
}
function resetPlayButton() {
    document.getElementById("pause").style.display = "none";
    document.getElementById("play").style.display = "inline";
}
function stepVolume(delta) {
    var volume = document.getElementById("volume").value / 100;
    volume = Math.min(Math.max(volume + delta, 0), 1);
    IodineGUI.mixerInput.setVolume(volume);
    document.getElementById("volume").value = Math.round(volume * 100);
}
function volChangeFunc() {
    IodineGUI.mixerInput.setVolume(Math.min(Math.max(parseInt(this.value), 0), 100) * 0.01);
};
function writeRedTemporaryText(textString) {
    if (IodineGUI.timerID) {
        clearTimeout(IodineGUI.timerID);
    }
    document.getElementById("tempMessage").style.display = "block";
    document.getElementById("tempMessage").textContent = textString;
    IodineGUI.timerID = setTimeout(clearTempString, 5000);
}
function clearTempString() {
    document.getElementById("tempMessage").style.display = "none";
}
//Some wrappers and extensions for non-DOM3 browsers:
function addEvent(sEvent, oElement, fListener) {
    try {    
        oElement.addEventListener(sEvent, fListener, false);
    }
    catch (error) {
        oElement.attachEvent("on" + sEvent, fListener);    //Pity for IE.
    }
}
function removeEvent(sEvent, oElement, fListener) {
    try {    
        oElement.removeEventListener(sEvent, fListener, false);
    }
    catch (error) {
        oElement.detachEvent("on" + sEvent, fListener);    //Pity for IE.
    }
}