#! /bin/bash

#download a given dataset from the website. By default it's cifar10, we can change it though!

NAME=cifar10
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
