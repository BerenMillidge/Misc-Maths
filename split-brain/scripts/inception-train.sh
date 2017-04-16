#! /bin/bash

#This trains a model from scratch. It'll probably be too slow to run, but we have it here anyway

CHECKPOINT_DIR=/tmp/checkpoints
DATASET_DIR=/tmp/imagenet
TRAIN_DIR=/tmp/train_logs
python train_image_classifier.py \
    --train_dir=${TRAIN_DIR} \
    --dataset_name=imagenet \
    --dataset_split_name=train \
    --dataset_dir=${DATASET_DIR} \
    --model_name=inception_v3
