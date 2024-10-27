import Nat8 "mo:base/Nat8";

import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

actor {
    // Stable variables for upgrade persistence
    private stable var nextId : Nat = 0;
    private stable var avatarEntries : [(Nat, Blob)] = [];

    // Runtime hashmap to store avatars
    private var avatars = HashMap.HashMap<Nat, Blob>(10, Nat.equal, Hash.hash);

    // System functions for upgrade persistence
    system func preupgrade() {
        avatarEntries := Iter.toArray(avatars.entries());
    };

    system func postupgrade() {
        avatars := HashMap.fromIter<Nat, Blob>(avatarEntries.vals(), 10, Nat.equal, Hash.hash);
        avatarEntries := [];
    };

    // Generate and store avatar from photo
    public shared func generateAvatar(photo : [Nat8]) : async Nat {
        let photoBlob = Blob.fromArray(photo);
        
        // Here we're simulating avatar generation by just storing the original photo
        // In a real implementation, you would process the photo to generate an avatar
        // For example, by calling an external API or implementing avatar generation logic
        
        let id = nextId;
        nextId += 1;
        
        avatars.put(id, photoBlob);
        return id;
    };

    // Retrieve avatar by ID
    public query func getAvatar(id : Nat) : async [Nat8] {
        switch (avatars.get(id)) {
            case null { [] };
            case (?avatar) { Blob.toArray(avatar) };
        };
    };
}
