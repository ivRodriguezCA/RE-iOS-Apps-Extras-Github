/*
 * coinza.js - Module 4 - Enabling 'ProVersion' features with Frida
 * Copyright (c) 2019 Ivan Rodriguez <ios [at] ivrodriguez.com>
 *
 * Free online course: Reverse Engineering iOS Applications
 * https://github.com/ivRodriguezCA/RE-iOS-Apps
*/

function dismissUAlertController() {
	var alertController = ObjC.classes.UIAlertController
	ObjC.choose(alertController, {
		onMatch: function (alert) {
			alert.dismissViewControllerAnimated_completion_(true, NULL);
			return 'stop';
		},
		onComplete: function () {
			console.log('[+] Done dismissing annoying alert!');
		}
	});
}

function bypassJailbreakDetection() {
	try {
		var hook = ObjC.classes.Utils['+ isJailbroken'];
		Interceptor.attach(hook.implementation, { 
	    	onLeave: function(oldValue) {
	    		_newValue = ptr("0x0") ;
	    		oldValue.replace(_newValue);
	    	}
	    });

	} catch(err) {
		console.log("[-] Error: " + err.message);
	}
}

function presentInitialVC() {
	var storyboardClass = ObjC.classes.UIStoryboard;
	var bundleClasss = ObjC.classes.NSBundle;
	var navConClass = ObjC.classes.UINavigationController;
	var applicationClass = ObjC.classes.UIApplication;

	var storyboard = storyboardClass.storyboardWithName_bundle_('Main',bundleClasss.mainBundle());
	var initialVC = storyboard.instantiateViewControllerWithIdentifier_('InitialViewController');

	var navCon = navConClass.alloc().initWithRootViewController_(initialVC);
	applicationClass.sharedApplication().keyWindow().rootViewController().presentViewController_animated_completion_(navCon, true, NULL);
}

function setProVersion() {
	var userDefaultsClass = ObjC.classes.NSUserDefaults;
	userDefaultsClass.setObject_forKey_(true,'isProVersion');
}

if (ObjC.available) {
	dismissUAlertController();
	bypassJailbreakDetection();
	presentInitialVC();
	setProVersion()
} else {
 	send("error: Objective-C Runtime is not available!");
}