"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
  isFollowing?: boolean;
}

interface FollowModalProps {
  type: 'Following' | 'Followers';
  users: User[];
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  children: React.ReactNode;
  userId?: string;
}

interface INextAuthUserProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  location: string;
}

export function FollowModal({ type, users, onFollow, onUnfollow, children, userId }: FollowModalProps) {
  const [user, setUser] = useState<INextAuthUserProps | null>(null);
  const [ followers, setFollowers ] = useState<any | null>(null);
  useEffect(()=>{
    async function fetchData () {
      const followers = await axios.get(`/api/followers?profileId=${userId}`);
      console.log(followers.data);
    }
    fetchData();
  },[])
  const handleFollow = (userId: string) => {
    onFollow?.(userId);
  };

  const handleUnfollow = (userId: string) => {
    onUnfollow?.(userId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>{type}</DialogTitle>
          <DialogDescription>
            {type === 'Following' 
              ? 'Users you are following' 
              : 'Users who follow you'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
          {users.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {type === 'Following' ? 'Not following anyone yet' : 'No followers yet'}
            </div>
          ) : (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.location}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {type === 'Following' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnfollow(user.id)}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button 
                      variant={user.isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={() => user.isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                    >
                      {user.isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}