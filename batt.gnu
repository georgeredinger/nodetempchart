set xdata time
set timefmt "%s"
set format x "%H:%M"
set xlabel "time"
set ylabel "Volts"
plot 'history.txt' using (($1/1000)-8*3600):($3) with lines;

