import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

actor {

  // Stable variables for persistence
  stable var admins : [Admin] = [];
  stable var contributors : [Contributor] = [];
  stable var goals : [ContributionGoal] = [];
  stable var contributions : [Contribution] = [];

  // Define the data structures
  public type Admin = {
    admin_id: Nat;
    name: Text;
    username: Text;
    password: Text;
  };

  public type Contributor = {
    id: Nat;
    name: Text;
    username: Text;
    password: Text;
    phone_number: Text;
  };

  public type ContributionGoal = {
    goal_id: Nat;
    goal_name: Text;
    goal_desc: Text;
    goal_target: Nat;
    contributor_id: Nat;
    date: Text;
  };

  public type Contribution = {
    contribution_id: Nat;
    contributor_id: Nat;
    goal_id: Nat;
    amount: Nat;
    date: Text;
    tx_id: Text;
    tx_ref: Text;
    payment_status: Text;
  };

  // ---------------------- Admin Functions ----------------------

  // Add a new admin
  public func addAdmin(admin_id: Nat, name: Text, username: Text, password: Text) : async () {
    let newAdmin : Admin = {
      admin_id;
      name;
      username;
      password;
    };
    admins := Array.append(admins, [newAdmin]);
  };

  // Admin login
  public query func adminLogin(username: Text, password: Text) : async ?Admin {
    return Array.find<Admin>(admins, func(admin) {
      admin.username == username and admin.password == password
    });
  };

  public query func getAdmins() : async [Admin] {
    return admins;
  };

  // ---------------------- Contributor Functions ----------------------

  // Add a new contributor
  public func addContributor(id: Nat, name: Text, username: Text, password: Text, phone_number: Text) : async () {
    let newContributor : Contributor = {
      id;
      name;
      username;
      password;
      phone_number;
    };
    contributors := Array.append(contributors, [newContributor]);
  };

  // Contributor login
  public query func contributorLogin(username: Text, password: Text) : async ?Contributor {
    return Array.find<Contributor>(contributors, func(contributor) {
      contributor.username == username and contributor.password == password
    });
  };

  public query func getContributors() : async [Contributor] {
    return contributors;
  };

  // ---------------------- Contribution Goal CRUD ----------------------

  // Add a new fundraising goal
  public func addGoal(goal_id: Nat, goal_name: Text, goal_desc: Text, goal_target: Nat, contributor_id: Nat, date: Text) : async () {
    let newGoal : ContributionGoal = {
      goal_id;
      goal_name;
      goal_desc;
      goal_target;
      contributor_id;
      date;
    };
    goals := Array.append(goals, [newGoal]);
  };

  // Get all goals
public query func getGoals() : async [ContributionGoal] {
    return goals;
  };

  // Get goal details by goal_id
  public query func getGoalDetails(goal_id: Nat) : async ?ContributionGoal {
    return Array.find<ContributionGoal>(goals, func(g) {
      g.goal_id == goal_id
    });
  };

  // Update a goal
  public func updateGoal(goal_id: Nat, goal_name: Text, goal_desc: Text, goal_target: Nat, date: Text) : async Bool {
    let updatedGoals = Array.filter<ContributionGoal>(goals, func(goal) {
      goal.goal_id == goal_id
    });

    if (Array.size(updatedGoals) == 0) {
      return false; // Goal with this id not found
    };

    let updatedGoal = updatedGoals[0];
    let newGoal = {
      goal_id = updatedGoal.goal_id;
      goal_name;
      goal_desc;
      goal_target;
      contributor_id = updatedGoal.contributor_id;
      date;
    };

    // Remove the old goal
    goals := Array.filter<ContributionGoal>(goals, func(g) {
      g.goal_id != goal_id
    });

    // Add the updated goal
    goals := Array.append(goals, [newGoal]);
    return true;
  };

  // Delete a goal
  public func deleteGoal(goal_id: Nat) : async Bool {
    let updatedGoals = Array.filter<ContributionGoal>(goals, func(g) {
      g.goal_id == goal_id
    });

    if (Array.size(updatedGoals) == 0) {
      return false; // Goal with this id not found
    };

    // Remove the old goal record
    goals := Array.filter<ContributionGoal>(goals, func(g) {
      g.goal_id != goal_id
    });

    return true; // Successfully deleted
  };

  // Filter goals by contributor
  public query func getGoalsByContributor(contributor_id: Nat) : async [ContributionGoal] {
    return Array.filter<ContributionGoal>(goals, func(g) {
      g.contributor_id == contributor_id
    });
  };

  // ---------------------- Contribution Functions ----------------------

  // Add a new contribution
  public func addContribution(contribution_id: Nat, contributor_id: Nat, goal_id: Nat, amount: Nat, date: Text, tx_id: Text, tx_ref: Text, payment_status: Text) : async () {
    let newContribution : Contribution = {
      contribution_id;
      contributor_id;
      goal_id;
      amount;
      date;
      tx_id;
      tx_ref;
      payment_status;
    };
    contributions := Array.append(contributions, [newContribution]);
  };

  // Get all contributions for a specific goal
  public query func getContributionsByGoal(goal_id: Nat) : async [Contribution] {
    return Array.filter<Contribution>(contributions, func(c) {
      c.goal_id == goal_id
    });
  };

  // Get all contributions by a specific contributor
  public query func getContributionsByContributor(contributor_id: Nat) : async [Contribution] {
    return Array.filter<Contribution>(contributions, func(c) {
      c.contributor_id == contributor_id
    });
  };

  // Get all contributions
  public query func getAllContributions() : async [Contribution] {
    return contributions;
  };
  
};
