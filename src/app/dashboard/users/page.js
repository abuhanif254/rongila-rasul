"use client";
import { useState, useEffect } from "react";
import { 
  Box, Typography, Card, CardContent, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  Avatar, Chip, Select, MenuItem, Stack, Alert, IconButton,
  Tooltip, TextField, InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Shield";
import RefreshIcon from "@mui/icons-material/Refresh";
import { db } from "@/lib/firebase";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const projectId = db.app.options.projectId;
    const apiKey = db.app.options.apiKey;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users?key=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.documents) {
        const formattedUsers = data.documents.map(doc => {
          const fields = doc.fields;
          return {
            id: doc.name.split("/").pop(),
            name: fields.name?.stringValue || "Unknown",
            email: fields.email?.stringValue || "",
            photo: fields.photo?.stringValue || "",
            role: fields.role?.stringValue || "reader",
          };
        });
        setUsers(formattedUsers);
      }
    } catch (err) {
      setError("Failed to fetch users. Please check your permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const projectId = db.app.options.projectId;
    const apiKey = db.app.options.apiKey;
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}?key=${apiKey}&updateMask.fieldPaths=role`;

    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            role: { stringValue: newRole }
          }
        })
      });

      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      setError("Failed to update user role.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "#c0392b";
      case "writer": return "#2c3e50";
      default: return "#94a3b8";
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={900} sx={{ color: "#0f172a", fontFamily: "'Playfair Display', serif" }}>
            User Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Assign roles and manage permissions for your newsroom team
          </Typography>
        </Box>
        <IconButton onClick={fetchUsers} sx={{ bgcolor: "white", border: "1px solid #e2e8f0" }}>
          <RefreshIcon />
        </IconButton>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Card sx={{ borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "none", overflow: "hidden" }}>
        <Box sx={{ p: 3, bgcolor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#94a3b8" }} /></InputAdornment>,
              sx: { bgcolor: "white", borderRadius: 2 }
            }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f1f5f9" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>USER</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}>Loading users...</TableCell></TableRow>
              ) : filteredUsers.map((user) => (
                <TableRow key={user.id} sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={user.photo} sx={{ width: 36, height: 36 }}>{user.name.charAt(0)}</Avatar>
                      <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      size="small" 
                      sx={{ 
                        fontWeight: 800, 
                        textTransform: "uppercase", 
                        fontSize: "0.65rem",
                        bgcolor: getRoleColor(user.role),
                        color: "white"
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e" }} />
                      <Typography variant="caption" fontWeight={600} color="#15803d">Active</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      sx={{ 
                        minWidth: 120, 
                        borderRadius: 2, 
                        fontSize: "0.85rem",
                        "& .MuiSelect-select": { py: 0.8 } 
                      }}
                    >
                      <MenuItem value="reader">Reader</MenuItem>
                      <MenuItem value="writer">Writer</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
