#! /bin/bash

# This script downloads the prewritten inception V3 checkpoint for the slim tf.contrib package. I think these sorts of base networks could be very useful for my project as I don't really have days to train convnets, at least not for my initial experiments, so I'll be mostly working on fine-tuning and proof of concept

CHECKPOINT_DIR=/afs/inf.ed.ac.uk/user/s16/s1686853/models
mkdir ${CHECKPOINT_DIR}
wget http://download.tensorflow.org/models/inception_v3_2016_08_28.tar.gz
tar -xvf inception_v3_2016_08_28.tar.gz
mv inception_v3.ckpt ${CHECKPOINT_DIR}
rm inception_v3_2016_08_28.tar.gz
