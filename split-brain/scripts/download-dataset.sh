#! /bin/bash

#download a given dataset from the website. By default it's cifar10, we can change it though!
#we've now added interactivity. this should make it more general, perhaps.

echo "Please enter the name of the dataset to download"
read name
echo
NAME=$name
echo "Downloading ${NAME}..."
DATA_DIR=$HOME/project/splitbrain/datasets/${NAME}
mkdir ${DATA_DIR}
PYSCRIPT=$HOME/project/models/slim
python ${PYSCRIPT}/download_and_convert_data.py \
    --dataset_name=${NAME} \
    --dataset_dir="${DATA_DIR}"

echo "Your data successfully downloaded. The files are as shown below"
echo
ls ${DATA_DIR}
echo
echo "They have been downloaded to ${DATA_DIR}"
echo

#I could modify this to take a command line argument with a default, but really  Ican't be bothered
#Seriously. this is just insane. the whole slim models thing doens't seem to work as it uses parts of tensorflow which seem to have been deprecated, and trying to debug this will probably be a nightmare. Ugh. I should probably just try to code it from scratch, but I think I'll try to go through the slim tutorial jupyter notebook first to see if anything good can be had of this, because if it can then it would speed things up immensely!
