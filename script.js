
const STORAGE_KEY = "ma-todo-list";

// Liste initiale proposée
const initialTasks = [
    {
        id: 1,
        title: "Organiser mes objectifs de la semaine",
        priority: "high",
        completed: false
    },
    {
        id: 2,
        title: "Apprendre les bases de JavaScript",
        priority: "medium",
        completed: false
    },
    {
        id: 3,
        title: "Faire du sport pendant 30 minutes",
        priority: "low",
        completed: false
    },
    {
        id: 4,
        title: "Lire 20 pages d'un livre",
        priority: "low",
        completed: false
    },
    {
        id: 5,
        title: "Préparer ma journée de demain",
        priority: "high",
        completed: false
    }
];

// Récupération des tâches sauvegardées
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (savedTasks === null) {
            return initialTasks;
        }

        const parsedTasks = JSON.parse(savedTasks);

        return Array.isArray(parsedTasks) ? parsedTasks : initialTasks;
    } catch (error) {
        console.error("Erreur de lecture :", error);
        return initialTasks;
    }
}

let tasks = loadTasks();
let currentFilter = "all";

// Éléments HTML
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

// Sauvegarder les tâches
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Afficher la date
const today = new Date();

document.getElementById("currentDate").textContent =
    today.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// Ajouter une tâche
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) return;

    const newTask = {
        id: Date.now(),
        title: title,
        priority: priorityInput.value,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    taskForm.reset();
    priorityInput.value = "medium";
    taskInput.focus();
});

// Afficher les tâches
function renderTasks() {
    taskList.replaceChildren();

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {
        const item = document.createElement("div");
        item.className = `task-item ${task.completed ? "done" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Marquer comme terminée");

        const content = document.createElement("div");
        content.className = "task-content";

        const name = document.createElement("p");
        name.className = "task-name";
        name.textContent = task.title;

        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;

        const priorityLabels = {
            high: "Haute",
            medium: "Moyenne",
            low: "Basse"
        };

        priority.textContent = priorityLabels[task.priority] || "Moyenne";

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.textContent = "✏️";
        editButton.type = "button";
        editButton.setAttribute("aria-label", "Modifier la tâche");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️";
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", "Supprimer la tâche");

        content.append(name);
        actions.append(editButton, deleteButton);

        item.append(checkbox, content, priority, actions);
        taskList.append(item);

        // Cocher / décocher
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Modifier
        editButton.addEventListener("click", () => {
            const newTitle = prompt("Modifier la tâche :", task.title);

            if (newTitle === null) return;

            if (newTitle.trim()) {
                task.title = newTitle.trim();
                saveTasks();
                renderTasks();
            }
        });

        // Supprimer
        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
        });
    });

    emptyMessage.hidden = filteredTasks.length !== 0;

    updateStats();
}

// Actualiser les statistiques
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const remaining = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("remainingTasks").textContent = remaining;
    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("progressPercent").textContent =
        percentage + "%";

    document.getElementById("progressFill").style.width =
        percentage + "%";
}

// Filtres
document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter.active").classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Supprimer toutes les tâches terminées
document.getElementById("clearCompleted").addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});

// Premier affichage
renderTasks();
