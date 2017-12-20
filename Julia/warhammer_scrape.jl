#our julia warhammer scrape script. fairly trivial, but fun

include("image_scraper.jl")
#for the warhammer one
#scrape_images("warhammer 40k", 500, "/home/beren/work/julia/warhammer_images")

function warhammer(base, num):
	races=("space marines", "imperial guard", "eldar", "tau", "warhammer 40k orks", "40k the emperor", "warhammer 40k chaos", "dark eldar", "necrons", "black library", "warhammer 40k inquisition")
	for race in races
		scrape_images(race, num, base * race)
	end
end

warhammer("home/beren/work/julia/warhammer_images/", 500)

