import { Plus } from 'lucide-react';
import { useChannelStore } from '../../stores';
import { Avatar } from '../ui';

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, setActiveWorkspace } = useChannelStore();

  return (
    <div className="flex flex-col items-center gap-2 py-3 px-2 bg-slate-950 border-r border-slate-800">
      {workspaces.map((workspace) => (
        <button
          key={workspace.id}
          onClick={() => setActiveWorkspace(workspace)}
          className={`
            relative rounded-2xl overflow-hidden transition-all duration-200
            ${activeWorkspace?.id === workspace.id
              ? 'rounded-xl ring-2 ring-indigo-500'
              : 'hover:rounded-xl'
            }
          `}
          title={workspace.name}
        >
          <Avatar
            src={workspace.icon}
            name={workspace.name}
            size="lg"
          />
          {workspace.channels.some((ch) => ch.unreadCount > 0) && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-slate-950" />
          )}
        </button>
      ))}

      <div className="w-12 h-0.5 bg-slate-800 rounded-full my-1" />

      <button
        className="
          w-12 h-12 rounded-2xl
          bg-slate-800 hover:bg-slate-700
          flex items-center justify-center
          text-green-500 hover:text-white hover:bg-green-600
          transition-all duration-200
          hover:rounded-xl
        "
        title="Add Workspace"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
