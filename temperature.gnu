set xdata time
set timefmt "%s"
set format x "%H:%M"
set xlabel "time"
set y2range [3.5:4.2]
plot 'history.txt' using (($1/1000)-8*3600):($2):($3) with lines;

