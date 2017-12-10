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
