import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function PollsPage() {
  const polls = useQuery(api.polls.getActivePolls);
  const currentUser = useQuery(api.users.getCurrentUser);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const votePoll = useMutation(api.polls.votePoll);
  
  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await votePoll({ pollId: pollId as any, optionId });
      toast.success("Vote submitted!");
    } catch (error) {
      toast.error("Failed to vote");
    }
  };

  const canCreatePolls = currentUser?.profile?.role === "admin";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Polls</h1>
          <p className="text-gray-400">Vote on the hottest topics in rap music</p>
        </div>
        
        {canCreatePolls && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
          >
            Create Poll
          </button>
        )}
      </div>

      <div className="space-y-6">
        {polls?.map((poll) => (
          <div key={poll._id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">{poll.title}</h3>
              {poll.description && (
                <p className="text-gray-300">{poll.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Ends: {new Date(poll.endDate).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-3">
              {poll.options.map((option) => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleVote(poll._id, option.id)}
                    className="w-full text-left p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 hover:border-gray-500"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{option.title}</span>
                      <span className="text-cyan-400 font-semibold">{option.votes} votes</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{percentage.toFixed(1)}%</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {polls?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🗳️</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No active polls</h3>
          <p className="text-gray-500">Check back later for community polls!</p>
        </div>
      )}

      {/* Create Poll Form Modal */}
      {showCreateForm && (
        <CreatePollForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}

function CreatePollForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [options, setOptions] = useState([{ title: "" }, { title: "" }]);
  
  const createPoll = useMutation(api.polls.createPoll);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validOptions = options.filter(opt => opt.title.trim());
    if (validOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }

    try {
      await createPoll({
        title,
        description: description || undefined,
        endDate: new Date(endDate).getTime(),
        options: validOptions.map((opt, index) => ({
          id: `option_${index}`,
          title: opt.title.trim(),
        })),
      });
      
      toast.success("Poll created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to create poll");
    }
  };

  const addOption = () => {
    setOptions([...options, { title: "" }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Poll</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Poll Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                placeholder="What's your poll about?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                placeholder="Optional description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Options *
              </label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={option.title}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index].title = e.target.value;
                        setOptions(newOptions);
                      }}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                      placeholder={`Option ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add Option
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
              >
                Create Poll
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
