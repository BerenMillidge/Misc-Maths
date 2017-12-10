using HTTP
using Gumbo
using AbstractTrees


print("in file okay")
url="https://stackoverflow.com/questions/37360340/how-to-pass-dict-as-the-argument-to-method-julia"

response = HTTP.get(url)
#print("successfully got url")
#print(response)
#print(response.body)
res=String(response.body)
fields = split(res, "<a")
#for field in fields
#	println(field)
#	end
"""
println(fields[1])

println("")
println("")
println(length(fields))
"""

# let's try this as a regex
#regex = r"^<a [a-z][A-Z][0-9]/=*</a"
#testregex=r"<a\s+(?:[^>]*?\s+)?href=([\"'])(.*?)\1"
#m = match(testregex, res)
#print(m)

doc = parsehtml(res)
print(doc)
println("")
print(typeof(doc))

#this is what we need. now we need to get the href inside of the a element!
for elem in PostOrderDFS(doc.root)
	if typeof(elem) == Gumbo.HTMLElement{:a}
		#we now get the href element
		link = get(elem.attributes, "href", 0)
		println(link)
		end
	end


# okay, we're going to use Gumbo to parse the html document and not regexes. let's try that


# let's test the argparse things

using ArgParse

# okay, let's set up some thingsfor our setting


#s = ArgParseSettings()

#now we add ourtable of arguments

#@add_arg_table s begin
#	"--opt1"
#		help = "an option with an argument"
#	"--opt2"
#		help="blqeh"
#		arg_type=Int
#		default = 0

#	"--flag1"
#		help="flag"
#		action=:store_true
#		"arg1"
#			help="a positional argument"
#			required=true



# so for our actual thing we would do something like

#t = ArgParseSettings()

#we can also improve our arg parse settings as follows with proper program descriptions and such which is really cool!

t = ArgParseSettings(	prog="Julia Web Crawler",
						description="A webcrawler written in Julia",
						commands_are_required=false,
						version="0.0.1"
						add_version=true,
						show_help=true)
@add_arg_table t begin
	"urls"
		help="either a url to start at or a set of urls to start visiting"
		required=true
	"--breadth-first", "-b"
		help="a flag of whether the crawler should search  breadth first or depth first"
		action=:store_true
end

# we then do actual arg parsing
parsed_args = parse_args(ARGS, t)


