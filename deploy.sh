npm run build
rm ../Axiomofchoice-hjt.github.io/puzzles/ -rf
mkdir ../Axiomofchoice-hjt.github.io/puzzles/
mv ./dist/* ../Axiomofchoice-hjt.github.io/puzzles/
cd ../Axiomofchoice-hjt.github.io
git add .
git commit -m "deploy"
git push origin main
echo deploy ok