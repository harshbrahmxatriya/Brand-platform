function UserCard({ user, isChatArea = false, handleSelectUser }) {
  return (
    <>
      {user ? (
        <div
          className={`user-card w-full flex cursor-pointer 
            items-center px-3 ${isChatArea ? "h-full" : "py-1.5"} border-b`}
          onClick={() => {
            handleSelectUser(user);
            console.log("user card is clicked");
          }}
        >
          <img
            className="h-14 w-14 object-cover rounded-full"
            src={user.profilePicture}
            alt={user.firstName}
          />
          <span className="text-lg ml-2">
            {user.firstName + " " + user.lastName}{" "}
          </span>
        </div>
      ) : (
        <h2></h2>
      )}
    </>
  );
}

export default UserCard;
