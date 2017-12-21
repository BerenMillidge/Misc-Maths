# a simple julia script to collect all our images into arrays and be happy there
# basically we collect all our images, read them into a massive array and then save them as numpy files, and possibly view them. it shouldn't be that difficult to be honest, but it's just what we do. we've got to figure out the walkdir file so let's just figure this out to be honest, I really don't know


using Base.Filesystem
using Images
using ImageView
using NPZ
using FileIO

const extensions = ("jpg","png","jpeg")




function getCurrentDirectory()
	return pwd()
end


function iterateThroughDirs(rootdir, basename="", save::Bool=true,verbose::Bool=true)
	for dirs in walkdir(rootdir)
		if verbose==true
			println("walking through dirs")
		end
		for dir in dirs
			if verbose==true
				println("Processing dir: " * string(dir))
			end
			arr = getImgArray(dir)
			if save==true
				fname = basename * "_" * string(dir) * "_images"
				saveNpzArray(fname, arr)
			end
		end
	end
end
		


function getImgArray(dir)
	#init array
	img_names = readdir(dir)
	counter = 0
	img_array = 0
	for img_name in img_names
	#for the moment I will just define it wrong so it's okay but then die afterwards  idon't know
		if counter ==0
			img_array = load(img_name)
		end
		if counter >0
			cat(3, img_array, load(img_name))
		end
		counter +=1
	end
	return img_array
end


function saveNpzArray(fname, arr)
	npz.write(fname*".npy", arr)
end
