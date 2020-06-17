#!/bin/bash

for file in `ls -1 res-reach/*.wiki`; do
	count=`grep '\[http.*\]' $file | wc -l`
	refs=`echo $file | sed -e's/.wiki/-references.wiki/' `
	# echo "$file -> $refs -> $count"
	# if article contains references AND
	if [ $count -gt 5 ]; then
		# if there is no references cache already for this article AND
		if [ ! -f $refs ]; then			
			# if the article isn't a references cache itself
			if [ -z `echo $file | grep references` ]; then
				# emit warning
				echo "No refs for $file "
			fi
		fi
	fi
done

