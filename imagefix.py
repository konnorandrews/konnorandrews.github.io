from PIL.ExifTags import TAGS
from PIL import Image

image_file = "C:/Users/konno/Documents/GitKraken/konnorandrews.github.io/images/20161014_154131.jpg"
im = Image.open(image_file)

#print("exif data:"),
#for tag, value in im._getexif().items():
#    tag_name = TAGS.get(tag, tag)
#    print("{}:{}".format(tag_name, value))

im.transpose(Image.ROTATE_270).save(image_file)
