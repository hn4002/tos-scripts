declare lower;

plot AccountNetLiq = GetNetLiq();
plot ZeroLine = 0;

AccountNetLiq.SetDefaultColor(GetColor(1));
AccountNetLiq.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
AccountNetLiq.DefineColor("Positive", Color.UPTICK);
AccountNetLiq.DefineColor("Negative", Color.DOWNTICK);
AccountNetLiq.AssignValueColor(if AccountNetLiq >= 0
    then AccountNetLiq.Color("Positive")
    else AccountNetLiq.Color("Negative"));
