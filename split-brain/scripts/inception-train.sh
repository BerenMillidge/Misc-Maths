#! /bin/bash

#This trains a model from scratch. It'll probably be too slow to run, but we have it here anyway
echo "Training"
NAME=cifar10
CHECKPOINT_DIR=/afs/inf.ed.ac.uk/user/s16/s1686853/models
DATASET_DIR=$HOME/project/splitbrain/datasets/${NAME}
TRAIN_DIR=$HOME/project/splitbrain/logs/${NAME}
mkdir ${TRAIN_DIR}
PYSCRIPT=$HOME/project/models/slim


python ${PYSCRIPT}/train_image_classifier.py \
    --train_dir=${TRAIN_DIR} \
    --dataset_name=imagenet \
    --dataset_split_name=train \
    --dataset_dir=${DATASET_DIR} \
    --model_name=inception_v3
