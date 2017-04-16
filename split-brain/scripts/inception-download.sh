#! /bin/bash

# This script downloads the prewritten inception V3 checkpoint for the slim tf.contrib package. I think these sorts of base networks could be very useful for my project as I don't really have days to train convnets, at least not for my initial experiments, so I'll be mostly working on fine-tuning and proof of concept

echo "Downloading inception model v3 checkpoint to models folder..."
echo "Continue? y/n"
read answer
CHECKPOINT_DIR=$HOME/project/splitbrain/models/inception
mkdir ${CHECKPOINT_DIR}
echo ${CHECKPOINT_DIR}
if [ $answer == "y" ]; then 
	#mkdir ${CHECKPOINT_DIR}/inception
	wget http://download.tensorflow.org/models/inception_v3_2016_08_28.tar.gz
	tar -xvf inception_v3_2016_08_28.tar.gz
	mv inception_v3.ckpt ${CHECKPOINT_DIR}
	rm inception_v3_2016_08_28.tar.gz
else
	echo "exiting"
fi

echo
