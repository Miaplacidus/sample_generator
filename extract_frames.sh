#!/bin/bash

for filename in $(ls webmfiles/*.webm | sort -n -t _ -k 3); do
  num=$(echo "$filename" | grep -o '[0-9]\+') 
    
  img_file="./training_set/train_img_${num}_%03d.jpeg"

  ffmpeg -i $filename -r 21 -s 42x32 -frames:v 105 -f image2 $img_file
done

