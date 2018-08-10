#!/bin/bash

for filename in $(find . -maxdepth 2 -name "*.jpeg"); do
  nums=$(echo $filename | ggrep -oP '[0-9]+') 
 
  vid_num=$(echo $nums | ggrep -oP '[0-9]+\s') 
  zero_pad_img_num=$(echo $nums | ggrep -oP '\s[0-9]+') 
  
  img_num=$(echo $zero_pad_img_num | sed 's/^0*//')

  file_basename=$(basename $filename) 

  if (($img_num % 3 == 0)); then
    mv "./training_set/$file_basename" "./training_set/labels/$file_basename"
  else
    mv "./training_set/$file_basename" "./training_set/features/$file_basename"
  fi 
done
