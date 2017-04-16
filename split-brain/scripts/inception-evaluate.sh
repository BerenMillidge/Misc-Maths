#! /bin/bash

#Here we evaluate the performance of the downloaded inception on imagenet. I should run these just to check my installation and stuff works

NAME=cifar10
CHECKPOINT_DIR=/afs/inf.ed.ac.uk/user/s16/s1686853/models
CHECKPOINT_FILE=${CHECKPOINT_DIR}/inception_v3.ckpt 
PYSCRIPT=$HOME/project/models/slim
DATASET_DIR=$HOME/project/splitbrain/datasets/${NAME}


python ${PYSCRIPT}/eval_image_classifier.py \
    --alsologtostderr \
    --checkpoint_path=${CHECKPOINT_FILE} \
    --dataset_dir=${DATASET_DIR} \
    --dataset_name=imagenet \
    --dataset_split_name=validation \
    --model_name=inception_v3
