clear
%%
%%%%%CONNECTING TO MONGODB ON EC2 SERVER%%%%%
server = "100.20.201.94";
port = 27017;
dbname = "pose-estimation";
conn = mongo(server, port, dbname, 'UserName', "jax", 'Password', "pass");
isopen(conn);
collection = "poses";
n = count(conn,collection);
documents = find(conn, collection);
target = input('Please enter the video: ','s');
%%
%%%%%LOOPING THROUGH ALL THE BODY POINTS%%%%%
confCut = .375;
time = 1;
for i = 1:n   
    user = documents(i).user.name;
    if strcmp(user,target)
        pose = documents(i).pose.points;
        poseLength = 17;
        t(time) = time;
        for j = 1:poseLength
            keypoints = pose.keypoints;
            points = keypoints(j);
            score = points.score;
            positionx = points.position.x;
            positiony = points.position.x;
            if (score > confCut)
                x(time) = points.position.x;
                y(time) = points.position.y;
            else
                x(time) = NaN;
                y(time) = NaN;
            end
        end
       time = time + 1;
    end
end
%%
%%%%%SMOOTH%%%%%
x2 = smoothdata(x, 'movmean');
y2 = smoothdata(y, 'movmean');
x3 = smoothdata(x2, 'movmean');
y3 = smoothdata(y2, 'movmean');

%%%%%GRAPH%%%%%
plot(x3, y3);
figure,
plot3(x3, y3, t)
xlabel('This is x')
ylabel('This is y')
zlabel('This is Frames')
title('This is the profile bodyline of a round-off back handspring')

%%%%%MAX AND MINS - LOCATE FOR CORRECTIONS%%%%%
[Maxima, MaxIdx] = findpeaks(y3);
DataInv = 1.01*max(y3) - y3;
[Minima, MinIdx] = findpeaks(DataInv);
%%
