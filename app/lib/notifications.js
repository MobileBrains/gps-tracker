exports.show = function(customMessage) {
    if (OS_ANDROID) {
        var toast = Ti.UI.createNotification({
            message: customMessage,
            duration: Ti.UI.NOTIFICATION_DURATION_LONG
        });
        toast.show();
    } else {
        var messageWindow = Titanium.UI.createWindow();

        var background = Titanium.UI.createView({
            height: Ti.UI.FILL,
            width: Ti.UI.FILL,
            backgroundColor: Alloy.Globals.colors.black,
            opacity: 0.4
        });

        messageWindow.add(background);

        var contentPane = Titanium.UI.createView({
            height: 150,
            width: 250,
            borderRadius: 10,
            backgroundColor: Alloy.Globals.colors.black
        });

        messageWindow.add(contentPane);

        var label = Titanium.UI.createLabel({
            text: customMessage,
            color: Alloy.Globals.colors.white,
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            textAlign: 'center',
            font: {
                fontSize: '14sp',
                fontWeight: 'bold'
            }
        });

        contentPane.add(label);
        messageWindow.open();

        setTimeout(function() {
            messageWindow.close({opacity:0, duration: 1000});
        }, 2500);
    }
};