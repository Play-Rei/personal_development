import React from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import ActivityCard from "../components/ActivityCard";
import StatsCard from "../components/StatsCard";
import NotificationsCard from "../components/NotificationsCard";
import NotesList from "../components/NotesList";
import VocabList from "../components/VocabList";

const DashboardPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <DashboardHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActivityCard />
          <StatsCard />
          <NotificationsCard />
        </div>
        {/* ノート一覧と単語帳一覧 */}
        <div className="flex flex-col gap-4 mt-8">
          <NotesList />
          <VocabList />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
