from kaffe.tensorflow import Network

class (Network):
    def setup(self):
        (self.feed('input')
             .conv(1, 1, 3, 1, 1, group=3, relu=False, name='data_lab')
             .conv(11, 11, 96, 4, 4, padding='VALID', name='conv1')
             .max_pool(3, 3, 2, 2, padding='VALID', name='pool1')
             .conv(5, 5, 256, 1, 1, group=2, name='conv2')
             .max_pool(3, 3, 2, 2, padding='VALID', name='pool2')
             .conv(3, 3, 384, 1, 1, name='conv3')
             .conv(3, 3, 384, 1, 1, group=2, name='conv4')
             .conv(3, 3, 256, 1, 1, group=2, name='conv5')
             .max_pool(3, 3, 2, 2, padding='VALID', name='pool5')
             .conv(6, 6, 4096, 1, 1, padding=None, name='fc6')
             .conv(1, 1, 4096, 1, 1, name='fc7'))