import type { BackendStreamEvent } from "@/types";

export const events: BackendStreamEvent[] = [
  {
    "type": "session_start",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:16.153725+00:00",
    "data": {
      "session_id": "a5ddcafd-f7d1-4581-994b-9132d4aaccd6",
      "manifest": {
        "agents": [
          {
            "name": "doc_expert",
            "description": "Explains what strands-compose IS: its mental model, unique value, supported orchestrations, and its streaming/wiring concepts.",
            "model": {
              "model_id": "global.anthropic.claude-haiku-4-5-20251001-v1:0",
              "provider": "strands.models.bedrock.BedrockModel"
            },
            "session_manager": null
          },
          {
            "name": "developer",
            "description": "Produces short, essential strands-compose examples: one small YAML config plus, if needed, one tiny Python file (a single tool or hook). Fast to read, showcase-focused.",
            "model": {
              "model_id": "global.anthropic.claude-haiku-4-5-20251001-v1:0",
              "provider": "strands.models.bedrock.BedrockModel"
            },
            "session_manager": null
          },
          {
            "name": "manager",
            "description": null,
            "model": {
              "model_id": "global.anthropic.claude-haiku-4-5-20251001-v1:0",
              "provider": "strands.models.bedrock.BedrockModel"
            },
            "session_manager": null
          },
          {
            "name": "main",
            "description": null,
            "model": {
              "model_id": "global.anthropic.claude-haiku-4-5-20251001-v1:0",
              "provider": "strands.models.bedrock.BedrockModel"
            },
            "session_manager": null
          }
        ],
        "orchestrations": [
          {
            "name": "main",
            "kind": "delegate",
            "session_manager": null,
            "nodes": [],
            "edges": null,
            "entry_node_id": null
          }
        ],
        "entry": {
          "name": "main",
          "kind": "orchestration"
        }
      }
    }
  },
  {
    "type": "agent_start",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:16.154407+00:00",
    "data": {}
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.065934+00:00",
    "data": {
      "text": "I"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.065980+00:00",
    "data": {
      "text": " am"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.067045+00:00",
    "data": {
      "text": " demo"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.067091+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.070031+00:00",
    "data": {
      "text": " of"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.090431+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.167192+00:00",
    "data": {
      "text": "ands"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.168171+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.169425+00:00",
    "data": {
      "text": "compose"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.268251+00:00",
    "data": {
      "text": ". I cannot"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.269278+00:00",
    "data": {
      "text": " answer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.269310+00:00",
    "data": {
      "text": " your"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.269487+00:00",
    "data": {
      "text": " specific"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.270026+00:00",
    "data": {
      "text": " questions"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.370725+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.370806+00:00",
    "data": {
      "text": " "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.371458+00:00",
    "data": {
      "text": "\nhowever"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.379253+00:00",
    "data": {
      "text": " let"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.473946+00:00",
    "data": {
      "text": " me present"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.474442+00:00",
    "data": {
      "text": " what str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.475803+00:00",
    "data": {
      "text": "ands-compose is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.477672+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.575816+00:00",
    "data": {
      "text": " what"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.577559+00:00",
    "data": {
      "text": " does"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.577638+00:00",
    "data": {
      "text": " it bring"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.579448+00:00",
    "data": {
      "text": " to the table "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.584539+00:00",
    "data": {
      "text": "\nand how you"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.678305+00:00",
    "data": {
      "text": " can use it"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.678941+00:00",
    "data": {
      "text": "\n\nLet"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.679325+00:00",
    "data": {
      "text": " me gather"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.680350+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.694092+00:00",
    "data": {
      "text": " essential"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.780948+00:00",
    "data": {
      "text": " knowledge"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.781385+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.781450+00:00",
    "data": {
      "text": " give"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:18.784792+00:00",
    "data": {
      "text": " you a comprehensive overview."
    }
  },
  {
    "type": "tool_start",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:19.604553+00:00",
    "data": {
      "tool_name": "doc_expert",
      "tool_label": "Delegating work to agent: Doc_Expert",
      "tool_use_id": "tooluse_QJQdwkFcCvXXHcpl4UkRa8",
      "tool_input": {
        "input": "What is strands-compose? What is its core purpose, and who is it for? What is the unique value it brings compared to building agents manually?"
      }
    }
  },
  {
    "type": "agent_start",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:19.605077+00:00",
    "data": {}
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.445268+00:00",
    "data": {
      "text": "I"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.446610+00:00",
    "data": {
      "text": "'ll start"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.448357+00:00",
    "data": {
      "text": " by listing"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.448689+00:00",
    "data": {
      "text": " the available"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.450802+00:00",
    "data": {
      "text": " documents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.450878+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.545561+00:00",
    "data": {
      "text": " then rea"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.546034+00:00",
    "data": {
      "text": "d the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.648051+00:00",
    "data": {
      "text": " overview"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.648477+00:00",
    "data": {
      "text": " to answer"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.649575+00:00",
    "data": {
      "text": " your question"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.651082+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "tool_start",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.855204+00:00",
    "data": {
      "tool_name": "list_docs",
      "tool_label": "list_docs",
      "tool_use_id": "tooluse_CBnJIVnkQQRo4QrjU4Tirn",
      "tool_input": {}
    }
  },
  {
    "type": "tool_end",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:21.858814+00:00",
    "data": {
      "tool_name": "list_docs",
      "tool_label": "list_docs",
      "tool_use_id": "tooluse_CBnJIVnkQQRo4QrjU4Tirn",
      "status": "success",
      "error": null,
      "tool_result": "[{\"name\": \"01_overview_and_value.md\", \"summary\": \"strands-compose — Overview & Unique Value\"}, {\"name\": \"02_technical_concepts.md\", \"summary\": \"strands-compose — Technical Concepts\"}, {\"name\": \"03_agentcore_deployment.md\", \"summary\": \"strands-compose-agentcore — Deploying Your Agents (the adapter package)\"}]"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:22.469772+00:00",
    "data": {
      "text": "Now"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:22.471780+00:00",
    "data": {
      "text": " let me read the overview "
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:22.472170+00:00",
    "data": {
      "text": "document:"
    }
  },
  {
    "type": "tool_start",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:22.776172+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_Sog8nXDIl5nDv9taBglJ05",
      "tool_input": {
        "name": "01_overview_and_value.md"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:22.778960+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_Sog8nXDIl5nDv9taBglJ05",
      "status": "success",
      "error": null,
      "tool_result": "# strands-compose — Overview & Unique Value\n\n*Conceptual doc. No code, no field-level details — just the mental model.*\n\n---\n\n## The one-liner\n\n**Think Docker Compose, but for AI agents.**\n\nstrands-compose is a declarative layer on top of [strands-agents](https://github.com/strands-agents).\nYou describe the *shape* of a multi-agent system in a YAML file, and strands-compose\nresolves, validates, and starts the whole thing as a live, fully wired system:\nmodels, tools, hooks, MCP connections, and the orchestration topology that ties agents together.\n\n## The problem it solves\n\nstrands-agents is a ..."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.697048+00:00",
    "data": {
      "text": "##"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.699324+00:00",
    "data": {
      "text": " What"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.699719+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.712806+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.735111+00:00",
    "data": {
      "text": "ands-compose?\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.797912+00:00",
    "data": {
      "text": "strands-compose is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.799020+00:00",
    "data": {
      "text": " a declar"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.801813+00:00",
    "data": {
      "text": "ative configuration"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.822696+00:00",
    "data": {
      "text": " layer"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.900747+00:00",
    "data": {
      "text": " for building"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.901191+00:00",
    "data": {
      "text": " multi-agent systems."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.902857+00:00",
    "data": {
      "text": "** Think"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.910704+00:00",
    "data": {
      "text": " of it like"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:23.932952+00:00",
    "data": {
      "text": " Docker"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.003013+00:00",
    "data": {
      "text": " Compose,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.003449+00:00",
    "data": {
      "text": " but for AI"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.004596+00:00",
    "data": {
      "text": " agents. You"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.105768+00:00",
    "data": {
      "text": " describe your agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.105852+00:00",
    "data": {
      "text": " system"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.106615+00:00",
    "data": {
      "text": " in a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.106983+00:00",
    "data": {
      "text": " YAML file, and str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.207703+00:00",
    "data": {
      "text": "ands-compose resol"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.209138+00:00",
    "data": {
      "text": "ves,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.209794+00:00",
    "data": {
      "text": " validates"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.211054+00:00",
    "data": {
      "text": ", and w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.212695+00:00",
    "data": {
      "text": "ires everything together —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.217505+00:00",
    "data": {
      "text": " models"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.337176+00:00",
    "data": {
      "text": ", tools"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.337599+00:00",
    "data": {
      "text": ", hooks"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.339579+00:00",
    "data": {
      "text": ", M"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.339920+00:00",
    "data": {
      "text": "CP"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.341539+00:00",
    "data": {
      "text": " connections"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.412708+00:00",
    "data": {
      "text": ", and the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.413443+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.413956+00:00",
    "data": {
      "text": "ration topology"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.416197+00:00",
    "data": {
      "text": ".\n\n## Core"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.515200+00:00",
    "data": {
      "text": " purpose"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.515883+00:00",
    "data": {
      "text": "\n\nIt"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.516236+00:00",
    "data": {
      "text": " sol"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.517242+00:00",
    "data": {
      "text": "ves the **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.525536+00:00",
    "data": {
      "text": "multi"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.617857+00:00",
    "data": {
      "text": "-agent pl"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.617946+00:00",
    "data": {
      "text": "umbing problem**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.618468+00:00",
    "data": {
      "text": ". While"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.619813+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.822634+00:00",
    "data": {
      "text": "ands-agents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.823015+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.823099+00:00",
    "data": {
      "text": " great"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.824485+00:00",
    "data": {
      "text": " for building a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.826365+00:00",
    "data": {
      "text": " single"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.826703+00:00",
    "data": {
      "text": " agent, the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.827957+00:00",
    "data": {
      "text": " moment"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.829409+00:00",
    "data": {
      "text": " you have"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.829752+00:00",
    "data": {
      "text": " multiple"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.833240+00:00",
    "data": {
      "text": " agents plus"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.924490+00:00",
    "data": {
      "text": " M"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.925756+00:00",
    "data": {
      "text": "CP servers"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:24.925834+00:00",
    "data": {
      "text": ", safety"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.027097+00:00",
    "data": {
      "text": " hooks"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.027731+00:00",
    "data": {
      "text": ", and share"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.028151+00:00",
    "data": {
      "text": "d models"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.029719+00:00",
    "data": {
      "text": ", you en"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.029808+00:00",
    "data": {
      "text": "d up han"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.031055+00:00",
    "data": {
      "text": "d-writing"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.129387+00:00",
    "data": {
      "text": " repet"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.276482+00:00",
    "data": {
      "text": "itive gl"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.277158+00:00",
    "data": {
      "text": "ue code:"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.277590+00:00",
    "data": {
      "text": " construct"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.278670+00:00",
    "data": {
      "text": "ing agents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.279633+00:00",
    "data": {
      "text": ", w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.281952+00:00",
    "data": {
      "text": "iring them as"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.282062+00:00",
    "data": {
      "text": " each"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.283362+00:00",
    "data": {
      "text": " other's"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.285410+00:00",
    "data": {
      "text": " tools"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.285779+00:00",
    "data": {
      "text": ", ordering"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.301261+00:00",
    "data": {
      "text": " startup"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.319060+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.340563+00:00",
    "data": {
      "text": " att"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.362658+00:00",
    "data": {
      "text": "aching hooks, threading"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.384353+00:00",
    "data": {
      "text": " sessions"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.406628+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.428369+00:00",
    "data": {
      "text": " strands-compose turns"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.449727+00:00",
    "data": {
      "text": " that"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.472205+00:00",
    "data": {
      "text": " bo"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.495768+00:00",
    "data": {
      "text": "ilerplate into review"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.515820+00:00",
    "data": {
      "text": "able configuration"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.540695+00:00",
    "data": {
      "text": ".\n\n## Who"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.559975+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.582340+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.623637+00:00",
    "data": {
      "text": " for"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.625775+00:00",
    "data": {
      "text": "\n\n- **Python"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.647383+00:00",
    "data": {
      "text": " developers** with"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.670129+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.693084+00:00",
    "data": {
      "text": "ands-agents experience"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.714218+00:00",
    "data": {
      "text": "\n- **Teams"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.736602+00:00",
    "data": {
      "text": "** who"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.760292+00:00",
    "data": {
      "text": " want their"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.782772+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.804072+00:00",
    "data": {
      "text": " systems to be review"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.826531+00:00",
    "data": {
      "text": "able, v"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.847665+00:00",
    "data": {
      "text": "ersionable, and reproducible\n-"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.872670+00:00",
    "data": {
      "text": " **Anyone"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.891743+00:00",
    "data": {
      "text": " building"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.914297+00:00",
    "data": {
      "text": " beyon"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.935789+00:00",
    "data": {
      "text": "d a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.957952+00:00",
    "data": {
      "text": " single agent** — the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:25.991421+00:00",
    "data": {
      "text": " value"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.002154+00:00",
    "data": {
      "text": " grows"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.023881+00:00",
    "data": {
      "text": " with system"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.045889+00:00",
    "data": {
      "text": " complexity\n\n##"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.067668+00:00",
    "data": {
      "text": " Unique"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.098687+00:00",
    "data": {
      "text": " value"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.120507+00:00",
    "data": {
      "text": " compare"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.141876+00:00",
    "data": {
      "text": "d to manual"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.163960+00:00",
    "data": {
      "text": " building"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.185863+00:00",
    "data": {
      "text": "\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.208339+00:00",
    "data": {
      "text": "1"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.230469+00:00",
    "data": {
      "text": ". No"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.252413+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.274099+00:00",
    "data": {
      "text": "rap"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.296455+00:00",
    "data": {
      "text": "pers —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.318801+00:00",
    "data": {
      "text": " you"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.340626+00:00",
    "data": {
      "text": " get"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.363828+00:00",
    "data": {
      "text": " real"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.385461+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.407495+00:00",
    "data": {
      "text": "ands objects back"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.431064+00:00",
    "data": {
      "text": "**\n\nAfter"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.451696+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.473247+00:00",
    "data": {
      "text": "loa"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.495090+00:00",
    "data": {
      "text": "d()"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.517183+00:00",
    "data": {
      "text": "`, what"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.538850+00:00",
    "data": {
      "text": " you get are"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.560821+00:00",
    "data": {
      "text": " plain"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.583622+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.605563+00:00",
    "data": {
      "text": "ands objects:"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.626917+00:00",
    "data": {
      "text": " real"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.649128+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.685519+00:00",
    "data": {
      "text": "str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.710777+00:00",
    "data": {
      "text": "ands.Agent` instances, real `"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.716380+00:00",
    "data": {
      "text": "strands.multi"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.736334+00:00",
    "data": {
      "text": "agent."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.758818+00:00",
    "data": {
      "text": "Swarm` or"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.781936+00:00",
    "data": {
      "text": " `Graph"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.802349+00:00",
    "data": {
      "text": "` orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.823857+00:00",
    "data": {
      "text": "rators"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.846399+00:00",
    "data": {
      "text": ", real M"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.876657+00:00",
    "data": {
      "text": "CP clients"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.898794+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.950837+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:26.981386+00:00",
    "data": {
      "text": "ands-compose is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.003590+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.026255+00:00",
    "data": {
      "text": " *"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.067191+00:00",
    "data": {
      "text": "composition"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.068918+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.090943+00:00",
    "data": {
      "text": "d w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.113146+00:00",
    "data": {
      "text": "iring layer*,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.134484+00:00",
    "data": {
      "text": " not a framework"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.158602+00:00",
    "data": {
      "text": " that"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.179670+00:00",
    "data": {
      "text": " sits"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.201436+00:00",
    "data": {
      "text": " between"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.243476+00:00",
    "data": {
      "text": " you and str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.246584+00:00",
    "data": {
      "text": "ands at"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.267909+00:00",
    "data": {
      "text": " runtime"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.288103+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.311652+00:00",
    "data": {
      "text": " Once"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.334821+00:00",
    "data": {
      "text": " built"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.354842+00:00",
    "data": {
      "text": ", it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.376490+00:00",
    "data": {
      "text": " steps"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.398444+00:00",
    "data": {
      "text": " out of the way."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.420170+00:00",
    "data": {
      "text": " This"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.442251+00:00",
    "data": {
      "text": " means"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.499471+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.499559+00:00",
    "data": {
      "text": "\n- If"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.508363+00:00",
    "data": {
      "text": " you know"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.530232+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.551714+00:00",
    "data": {
      "text": "ands,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.574476+00:00",
    "data": {
      "text": " you already"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.596347+00:00",
    "data": {
      "text": " know str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.618620+00:00",
    "data": {
      "text": "ands-compose\n- No"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.640436+00:00",
    "data": {
      "text": " lock"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.662183+00:00",
    "data": {
      "text": "-in, no le"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.707396+00:00",
    "data": {
      "text": "aky"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.711765+00:00",
    "data": {
      "text": " abst"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.727393+00:00",
    "data": {
      "text": "raction,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.750160+00:00",
    "data": {
      "text": " full"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.771811+00:00",
    "data": {
      "text": " access"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.815342+00:00",
    "data": {
      "text": " to the str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.817636+00:00",
    "data": {
      "text": "ands API"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.859110+00:00",
    "data": {
      "text": "\n\n**2. Unifie"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.881573+00:00",
    "data": {
      "text": "d streaming"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.903158+00:00",
    "data": {
      "text": " across"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.925325+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.947445+00:00",
    "data": {
      "text": " entire"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.969771+00:00",
    "data": {
      "text": " system**\n\nOne"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:27.991502+00:00",
    "data": {
      "text": " call"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.012896+00:00",
    "data": {
      "text": " wires an event publisher into every agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.034594+00:00",
    "data": {
      "text": " and orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.057470+00:00",
    "data": {
      "text": "rator at"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.079189+00:00",
    "data": {
      "text": " any"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.100520+00:00",
    "data": {
      "text": " depth"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.122630+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.144654+00:00",
    "data": {
      "text": " f"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.167119+00:00",
    "data": {
      "text": "unneling everything into one uniform"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.188472+00:00",
    "data": {
      "text": " stream. Whether"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.210641+00:00",
    "data": {
      "text": " you have one agent or a delegate containing"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.232933+00:00",
    "data": {
      "text": " a swarm containing a graph three levels"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.254491+00:00",
    "data": {
      "text": " deep"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.300735+00:00",
    "data": {
      "text": ", you get one stream"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.301699+00:00",
    "data": {
      "text": " with"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.320511+00:00",
    "data": {
      "text": " consistent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.343102+00:00",
    "data": {
      "text": " event"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.364377+00:00",
    "data": {
      "text": " shapes."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.386685+00:00",
    "data": {
      "text": " No"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.414558+00:00",
    "data": {
      "text": " topology"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.430573+00:00",
    "data": {
      "text": "-specific code needed.\n\n**3"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.452415+00:00",
    "data": {
      "text": ". Configuration"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.474722+00:00",
    "data": {
      "text": " as data**\n\nYour entire agent network"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.495982+00:00",
    "data": {
      "text": " lives in"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.518114+00:00",
    "data": {
      "text": " YAML ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.540168+00:00",
    "data": {
      "text": "plus small"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.717797+00:00",
    "data": {
      "text": " Python files for custom tools). This"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.717885+00:00",
    "data": {
      "text": " enables"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.720634+00:00",
    "data": {
      "text": ":\n- **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.720724+00:00",
    "data": {
      "text": "Versioning** — commit to Git,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.720788+00:00",
    "data": {
      "text": " diff"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.721345+00:00",
    "data": {
      "text": " versions"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.743847+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.744285+00:00",
    "data": {
      "text": " see exactly what changed\n- **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.759384+00:00",
    "data": {
      "text": "Regist"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.816626+00:00",
    "data": {
      "text": "ries** — a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.819762+00:00",
    "data": {
      "text": " folder of configs"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.882105+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.883589+00:00",
    "data": {
      "text": " a complete"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.885037+00:00",
    "data": {
      "text": " registry"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.893553+00:00",
    "data": {
      "text": " of agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.913346+00:00",
    "data": {
      "text": " environments\n- **Automate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.934928+00:00",
    "data": {
      "text": "d experiments"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.957049+00:00",
    "data": {
      "text": "** — generate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:28.979332+00:00",
    "data": {
      "text": " dozens"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.001747+00:00",
    "data": {
      "text": " of config"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.022904+00:00",
    "data": {
      "text": " variations an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.044709+00:00",
    "data": {
      "text": "d evaluate them programmatically\n- **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.066880+00:00",
    "data": {
      "text": "Reproducibility** — a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.089569+00:00",
    "data": {
      "text": " bug report comes with its exact config;"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.110646+00:00",
    "data": {
      "text": " load it, replay it, debug it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.133162+00:00",
    "data": {
      "text": "\n\n**4. Composable orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.154792+00:00",
    "data": {
      "text": "rations"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.176625+00:00",
    "data": {
      "text": "**\n\nYou"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.198682+00:00",
    "data": {
      "text": " can nest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.220112+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.242284+00:00",
    "data": {
      "text": " three"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.264152+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.286540+00:00",
    "data": {
      "text": "ration styles"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.308191+00:00",
    "data": {
      "text": " arbit"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.329986+00:00",
    "data": {
      "text": "rarily:"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.353642+00:00",
    "data": {
      "text": " delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.374352+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.395830+00:00",
    "data": {
      "text": "hub"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.417753+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.439775+00:00",
    "data": {
      "text": "and-spoke), swarm (peer"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.461938+00:00",
    "data": {
      "text": " collaboration"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.484203+00:00",
    "data": {
      "text": "), an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.506559+00:00",
    "data": {
      "text": "d graph (determin"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.533593+00:00",
    "data": {
      "text": "istic pipeline"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.552850+00:00",
    "data": {
      "text": "). A"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.574776+00:00",
    "data": {
      "text": " sw"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.596631+00:00",
    "data": {
      "text": "arm can be"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.618568+00:00",
    "data": {
      "text": " a tool"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.639959+00:00",
    "data": {
      "text": " inside"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.662673+00:00",
    "data": {
      "text": " a delegate, a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.684869+00:00",
    "data": {
      "text": " delegate can be a node"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.705763+00:00",
    "data": {
      "text": " in a graph, and so"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.727619+00:00",
    "data": {
      "text": " on."
    }
  },
  {
    "type": "agent_complete",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:29.825094+00:00",
    "data": {
      "usage": {
        "input_tokens": 5853,
        "output_tokens": 761,
        "total_tokens": 6614
      },
      "text": "## What is strands-compose?\n\n**strands-compose is a declarative configuration layer for building multi-agent systems.** Think of it like Docker Compose, but for AI agents. You describe your agent system in a YAML file, and strands-compose resolves, validates, and wires everything together — models, tools, hooks, MCP connections, and the orchestration topology.\n\n## Core purpose\n\nIt solves the **multi-agent plumbing problem**. While strands-agents is great for building a single agent, the moment you have multiple agents plus MCP servers, safety hooks, and shared models, you end up hand-writing repetitive glue code: constructing agents, wiring them as each other's tools, ordering startup, attaching hooks, threading sessions. strands-compose turns that boilerplate into reviewable configuration.\n\n## Who it is for\n\n- **Python developers** with strands-agents experience\n- **Teams** who want their agent systems to be reviewable, versionable, and reproducible\n- **Anyone building beyond a single agent** — the value grows with system complexity\n\n## Unique value compared to manual building\n\n**1. No wrappers — you get real strands objects back**\n\nAfter `load()`, what you get are plain strands objects: real `strands.Agent` instances, real `strands.multiagent.Swarm` or `Graph` orchestrators, real MCP clients. strands-compose is a *composition and wiring layer*, not a framework that sits between you and strands at runtime. Once built, it steps out of the way. This means:\n- If you know strands, you already know strands-compose\n- No lock-in, no leaky abstraction, full access to the strands API\n\n**2. Unified streaming across the entire system**\n\nOne call wires an event publisher into every agent and orchestrator at any depth, funneling everything into one uniform stream. Whether you have one agent or a delegate containing a swarm containing a graph three levels deep, you get one stream with consistent event shapes. No topology-specific code needed.\n\n**3. Configuration as data**\n\nYour entire agent network lives in YAML (plus small Python files for custom tools). This enables:\n- **Versioning** — commit to Git, diff versions, see exactly what changed\n- **Registries** — a folder of configs is a complete registry of agent environments\n- **Automated experiments** — generate dozens of config variations and evaluate them programmatically\n- **Reproducibility** — a bug report comes with its exact config; load it, replay it, debug it\n\n**4. Composable orchestrations**\n\nYou can nest the three orchestration styles arbitrarily: delegate (hub-and-spoke), swarm (peer collaboration), and graph (deterministic pipeline). A swarm can be a tool inside a delegate, a delegate can be a node in a graph, and so on.\n",
      "message": {
        "role": "assistant",
        "content": [
          {
            "text": "## What is strands-compose?\n\n**strands-compose is a declarative configuration layer for building multi-agent systems.** Think of it like Docker Compose, but for AI agents. You describe your agent system in a YAML file, and strands-compose resolves, validates, and wires everything together — models, tools, hooks, MCP connections, and the orchestration topology.\n\n## Core purpose\n\nIt solves the **multi-agent plumbing problem**. While strands-agents is great for building a single agent, the moment you have multiple agents plus MCP servers, safety hooks, and shared models, you end up hand-writing repetitive glue code: constructing agents, wiring them as each other's tools, ordering startup, attaching hooks, threading sessions. strands-compose turns that boilerplate into reviewable configuration.\n\n## Who it is for\n\n- **Python developers** with strands-agents experience\n- **Teams** who want their agent systems to be reviewable, versionable, and reproducible\n- **Anyone building beyond a single agent** — the value grows with system complexity\n\n## Unique value compared to manual building\n\n**1. No wrappers — you get real strands objects back**\n\nAfter `load()`, what you get are plain strands objects: real `strands.Agent` instances, real `strands.multiagent.Swarm` or `Graph` orchestrators, real MCP clients. strands-compose is a *composition and wiring layer*, not a framework that sits between you and strands at runtime. Once built, it steps out of the way. This means:\n- If you know strands, you already know strands-compose\n- No lock-in, no leaky abstraction, full access to the strands API\n\n**2. Unified streaming across the entire system**\n\nOne call wires an event publisher into every agent and orchestrator at any depth, funneling everything into one uniform stream. Whether you have one agent or a delegate containing a swarm containing a graph three levels deep, you get one stream with consistent event shapes. No topology-specific code needed.\n\n**3. Configuration as data**\n\nYour entire agent network lives in YAML (plus small Python files for custom tools). This enables:\n- **Versioning** — commit to Git, diff versions, see exactly what changed\n- **Registries** — a folder of configs is a complete registry of agent environments\n- **Automated experiments** — generate dozens of config variations and evaluate them programmatically\n- **Reproducibility** — a bug report comes with its exact config; load it, replay it, debug it\n\n**4. Composable orchestrations**\n\nYou can nest the three orchestration styles arbitrarily: delegate (hub-and-spoke), swarm (peer collaboration), and graph (deterministic pipeline). A swarm can be a tool inside a delegate, a delegate can be a node in a graph, and so on."
          }
        ],
        "metadata": {
          "usage": {
            "inputTokens": 2996,
            "outputTokens": 645,
            "totalTokens": 3641
          },
          "metrics": {
            "latencyMs": 7006,
            "timeToFirstByteMs": 914
          }
        },
        "tracking_id": "e55e1586-f034-47df-b3a5-ab35b30c9986"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:29.825543+00:00",
    "data": {
      "tool_name": "doc_expert",
      "tool_label": "Delegating work to agent: Doc_Expert",
      "tool_use_id": "tooluse_QJQdwkFcCvXXHcpl4UkRa8",
      "status": "success",
      "error": null,
      "tool_result": "## What is strands-compose?\n\n**strands-compose is a declarative configuration layer for building multi-agent systems.** Think of it like Docker Compose, but for AI agents. You describe your agent system in a YAML file, and strands-compose resolves, validates, and wires everything together — models, tools, hooks, MCP connections, and the orchestration topology.\n\n## Core purpose\n\nIt solves the **multi-agent plumbing problem**. While strands-agents is great for building a single agent, the moment you have multiple agents plus MCP servers, safety hooks, and shared models, you end up hand-writing r..."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.626327+00:00",
    "data": {
      "text": "Goo"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.647744+00:00",
    "data": {
      "text": "d start"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.649453+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.666759+00:00",
    "data": {
      "text": " Now"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.688475+00:00",
    "data": {
      "text": " let me understan"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.710599+00:00",
    "data": {
      "text": "d the orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.732380+00:00",
    "data": {
      "text": "ration modes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.762488+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.786459+00:00",
    "data": {
      "text": "d the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.806622+00:00",
    "data": {
      "text": " core"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.829181+00:00",
    "data": {
      "text": " technical"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.852780+00:00",
    "data": {
      "text": " concepts"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.874616+00:00",
    "data": {
      "text": " better"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:30.896420+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "tool_start",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:32.043207+00:00",
    "data": {
      "tool_name": "doc_expert",
      "tool_label": "Delegating work to agent: Doc_Expert",
      "tool_use_id": "tooluse_7Li6OdRzvUsLzpYPtyyMxW",
      "tool_input": {
        "input": "Explain the three orchestration modes (delegate, swarm, graph) in simple terms. What does each one do? When would you use each?"
      }
    }
  },
  {
    "type": "agent_start",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.043689+00:00",
    "data": {}
  },
  {
    "type": "tool_start",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:32.046549+00:00",
    "data": {
      "tool_name": "doc_expert",
      "tool_label": "Delegating work to agent: Doc_Expert",
      "tool_use_id": "tooluse_S08gqFV6JTQCJjW9Q3ijoK",
      "tool_input": {
        "input": "What are the key technical building blocks in strands-compose? Explain tools, hooks, sessions, and the \"native objects\" idea in a way a beginner can understand."
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:32.046817+00:00",
    "data": {
      "tool_name": "doc_expert",
      "tool_label": "Delegating work to agent: Doc_Expert",
      "tool_use_id": "tooluse_S08gqFV6JTQCJjW9Q3ijoK",
      "status": "error",
      "error": "Agent is already processing a request. Concurrent invocations are not supported.",
      "tool_result": "Error: ConcurrencyException - Agent is already processing a request. Concurrent invocations are not supported."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.826305+00:00",
    "data": {
      "text": "I already"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.842980+00:00",
    "data": {
      "text": " have"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.844848+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.860506+00:00",
    "data": {
      "text": " overview"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.886575+00:00",
    "data": {
      "text": " "
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.904372+00:00",
    "data": {
      "text": "document loade"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.952220+00:00",
    "data": {
      "text": "d, which"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.953594+00:00",
    "data": {
      "text": " contains"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.970804+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:32.991453+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.014126+00:00",
    "data": {
      "text": "ration concepts"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.036719+00:00",
    "data": {
      "text": ". Let me extract"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.059669+00:00",
    "data": {
      "text": " the relevant"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.089087+00:00",
    "data": {
      "text": " section"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.100688+00:00",
    "data": {
      "text": " for"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.123055+00:00",
    "data": {
      "text": " you:"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.144751+00:00",
    "data": {
      "text": "\n\nFrom"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.252582+00:00",
    "data": {
      "text": " the overview"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.257941+00:00",
    "data": {
      "text": " "
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.261200+00:00",
    "data": {
      "text": "document, here are the three orchestration modes"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.265079+00:00",
    "data": {
      "text": ":\n\n## **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.276683+00:00",
    "data": {
      "text": "Delegate**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.297770+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.319590+00:00",
    "data": {
      "text": " Hub"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.340926+00:00",
    "data": {
      "text": "-and-spoke"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.362867+00:00",
    "data": {
      "text": " pattern"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.385212+00:00",
    "data": {
      "text": "\nOne"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.406632+00:00",
    "data": {
      "text": " coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.428727+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.449880+00:00",
    "data": {
      "text": " treats"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.520512+00:00",
    "data": {
      "text": " other"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.576437+00:00",
    "data": {
      "text": " agents as tools"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.582728+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.584364+00:00",
    "data": {
      "text": " can call"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.596809+00:00",
    "data": {
      "text": ". The coordinator has"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.620019+00:00",
    "data": {
      "text": " explicit"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.711914+00:00",
    "data": {
      "text": " control over who"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.714795+00:00",
    "data": {
      "text": " does"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.717609+00:00",
    "data": {
      "text": " what and when."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.719318+00:00",
    "data": {
      "text": "\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.760673+00:00",
    "data": {
      "text": "When to use:**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.761095+00:00",
    "data": {
      "text": " When you want"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.772082+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.792540+00:00",
    "data": {
      "text": " \""
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.814981+00:00",
    "data": {
      "text": "boss"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.836196+00:00",
    "data": {
      "text": "\" making"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.858159+00:00",
    "data": {
      "text": " decisions about task"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.880377+00:00",
    "data": {
      "text": " flow"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.901961+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.923727+00:00",
    "data": {
      "text": " Example"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.947963+00:00",
    "data": {
      "text": ": a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.967469+00:00",
    "data": {
      "text": " manager agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:33.989875+00:00",
    "data": {
      "text": " that decides whether"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.013342+00:00",
    "data": {
      "text": " to route"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.034748+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.142819+00:00",
    "data": {
      "text": " request"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.147012+00:00",
    "data": {
      "text": " to a sales"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.148936+00:00",
    "data": {
      "text": " agent,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.153141+00:00",
    "data": {
      "text": " support"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.154318+00:00",
    "data": {
      "text": " agent, or technical specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.166523+00:00",
    "data": {
      "text": ".\n\n---"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.188715+00:00",
    "data": {
      "text": "\n\n## **Swarm** —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.209947+00:00",
    "data": {
      "text": " Peer collaboration"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.301207+00:00",
    "data": {
      "text": "\nAgents han"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.305197+00:00",
    "data": {
      "text": "d control"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.308059+00:00",
    "data": {
      "text": " off"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.309146+00:00",
    "data": {
      "text": " to each other autonom"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.319169+00:00",
    "data": {
      "text": "ously,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.341098+00:00",
    "data": {
      "text": " with no"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.673541+00:00",
    "data": {
      "text": " central coordinator."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.673978+00:00",
    "data": {
      "text": " They"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.674421+00:00",
    "data": {
      "text": " negotiate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.675092+00:00",
    "data": {
      "text": " and collaborate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.675251+00:00",
    "data": {
      "text": " directly"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.675279+00:00",
    "data": {
      "text": ".\n\n**When to use:**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.675301+00:00",
    "data": {
      "text": " Negoti"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.675866+00:00",
    "data": {
      "text": "ation"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.676384+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.676810+00:00",
    "data": {
      "text": "style"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.677348+00:00",
    "data": {
      "text": " loops"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.677936+00:00",
    "data": {
      "text": " like"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.677968+00:00",
    "data": {
      "text": " draft"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.678479+00:00",
    "data": {
      "text": " →"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.678853+00:00",
    "data": {
      "text": " review → rev"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.700449+00:00",
    "data": {
      "text": "ise. Example"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.731098+00:00",
    "data": {
      "text": ": a writer"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.732806+00:00",
    "data": {
      "text": " agent draf"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.754672+00:00",
    "data": {
      "text": "ts"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.778669+00:00",
    "data": {
      "text": " content"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.798975+00:00",
    "data": {
      "text": ", a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.820208+00:00",
    "data": {
      "text": " reviewer agent crit"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.842689+00:00",
    "data": {
      "text": "iques it, an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.864060+00:00",
    "data": {
      "text": "d they"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.885865+00:00",
    "data": {
      "text": " iterate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.994179+00:00",
    "data": {
      "text": " back"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:34.999795+00:00",
    "data": {
      "text": " and forth until"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.002057+00:00",
    "data": {
      "text": " satisfie"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.004948+00:00",
    "data": {
      "text": "d —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.009534+00:00",
    "data": {
      "text": " no"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.017299+00:00",
    "data": {
      "text": " central orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.039551+00:00",
    "data": {
      "text": "rator directing"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.092034+00:00",
    "data": {
      "text": " them"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.092981+00:00",
    "data": {
      "text": ".\n\n---\n\n## **Graph**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.104504+00:00",
    "data": {
      "text": " — Deterministic pipeline\nAgents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.127761+00:00",
    "data": {
      "text": " run"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.147705+00:00",
    "data": {
      "text": " in a fixe"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.169497+00:00",
    "data": {
      "text": "d dependency"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.191680+00:00",
    "data": {
      "text": " order"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.213671+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.235297+00:00",
    "data": {
      "text": "a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.280735+00:00",
    "data": {
      "text": " DA"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.281602+00:00",
    "data": {
      "text": "G —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.300829+00:00",
    "data": {
      "text": " directe"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.322595+00:00",
    "data": {
      "text": "d acyclic graph),"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.368710+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.372944+00:00",
    "data": {
      "text": "d independent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.388278+00:00",
    "data": {
      "text": " steps"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.413340+00:00",
    "data": {
      "text": " can"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.471205+00:00",
    "data": {
      "text": " run in parallel.\n\n**When to"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.478542+00:00",
    "data": {
      "text": " use:** When you know"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.482841+00:00",
    "data": {
      "text": " the exact processing"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.497395+00:00",
    "data": {
      "text": " order up"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.521513+00:00",
    "data": {
      "text": "front."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.541353+00:00",
    "data": {
      "text": " Example: a data pipeline"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.568599+00:00",
    "data": {
      "text": " where one"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.615969+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.646572+00:00",
    "data": {
      "text": " extra"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.654051+00:00",
    "data": {
      "text": "cts data,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.658355+00:00",
    "data": {
      "text": " another validates"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.675200+00:00",
    "data": {
      "text": " it, and a third transforms"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.694378+00:00",
    "data": {
      "text": " it —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.716278+00:00",
    "data": {
      "text": " each"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.738504+00:00",
    "data": {
      "text": " step depends"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.760031+00:00",
    "data": {
      "text": " on the previous one"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.781907+00:00",
    "data": {
      "text": ".\n\n---\n\n## The"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.803697+00:00",
    "data": {
      "text": " key"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.824959+00:00",
    "data": {
      "text": " composition"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.846943+00:00",
    "data": {
      "text": " idea"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.890577+00:00",
    "data": {
      "text": "\n\nThese"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.911930+00:00",
    "data": {
      "text": " are"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.934349+00:00",
    "data": {
      "text": " not"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.955873+00:00",
    "data": {
      "text": " three"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.980313+00:00",
    "data": {
      "text": " separate products"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:35.999494+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.021759+00:00",
    "data": {
      "text": " they are"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.043173+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.065700+00:00",
    "data": {
      "text": "building"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.087880+00:00",
    "data": {
      "text": " blocks that"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.108391+00:00",
    "data": {
      "text": " click"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.130595+00:00",
    "data": {
      "text": " together**. You"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.152008+00:00",
    "data": {
      "text": " can nest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.174246+00:00",
    "data": {
      "text": " them arbitrarily:"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.199312+00:00",
    "data": {
      "text": "\n- A"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.220372+00:00",
    "data": {
      "text": " sw"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.239968+00:00",
    "data": {
      "text": "arm can become"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.286075+00:00",
    "data": {
      "text": " a tool"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.290469+00:00",
    "data": {
      "text": " inside a delegate\n- A delegate can"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.304713+00:00",
    "data": {
      "text": " be"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.327594+00:00",
    "data": {
      "text": " a node inside"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.353958+00:00",
    "data": {
      "text": " a graph\n- An"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.370870+00:00",
    "data": {
      "text": "d so on"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.394965+00:00",
    "data": {
      "text": "\n\nstr"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.416071+00:00",
    "data": {
      "text": "ands-compose figures"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.437017+00:00",
    "data": {
      "text": " out the correct"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.458382+00:00",
    "data": {
      "text": " buil"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.481095+00:00",
    "data": {
      "text": "d order ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.502466+00:00",
    "data": {
      "text": "inner"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.524658+00:00",
    "data": {
      "text": " systems"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.546301+00:00",
    "data": {
      "text": " first"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.625149+00:00",
    "data": {
      "text": "),"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.633517+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.636503+00:00",
    "data": {
      "text": "ires everything"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.638358+00:00",
    "data": {
      "text": " up"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.655295+00:00",
    "data": {
      "text": ", and catches"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.678035+00:00",
    "data": {
      "text": " impossible"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.699675+00:00",
    "data": {
      "text": " top"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.722136+00:00",
    "data": {
      "text": "ologies ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.743386+00:00",
    "data": {
      "text": "like circular"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.765247+00:00",
    "data": {
      "text": " references"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.787149+00:00",
    "data": {
      "text": ") before"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.808583+00:00",
    "data": {
      "text": " anything"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.831710+00:00",
    "data": {
      "text": " runs."
    }
  },
  {
    "type": "agent_complete",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:36.987469+00:00",
    "data": {
      "usage": {
        "input_tokens": 3676,
        "output_tokens": 393,
        "total_tokens": 4069
      },
      "text": "I already have the overview document loaded, which contains the orchestration concepts. Let me extract the relevant section for you:\n\nFrom the overview document, here are the three orchestration modes:\n\n## **Delegate** — Hub-and-spoke pattern\nOne coordinator agent treats other agents as tools it can call. The coordinator has explicit control over who does what and when.\n\n**When to use:** When you want a \"boss\" making decisions about task flow. Example: a manager agent that decides whether to route a request to a sales agent, support agent, or technical specialist.\n\n---\n\n## **Swarm** — Peer collaboration\nAgents hand control off to each other autonomously, with no central coordinator. They negotiate and collaborate directly.\n\n**When to use:** Negotiation-style loops like draft → review → revise. Example: a writer agent drafts content, a reviewer agent critiques it, and they iterate back and forth until satisfied — no central orchestrator directing them.\n\n---\n\n## **Graph** — Deterministic pipeline\nAgents run in a fixed dependency order (a DAG — directed acyclic graph), and independent steps can run in parallel.\n\n**When to use:** When you know the exact processing order upfront. Example: a data pipeline where one agent extracts data, another validates it, and a third transforms it — each step depends on the previous one.\n\n---\n\n## The key composition idea\n\nThese are not three separate products — they are **building blocks that click together**. You can nest them arbitrarily:\n- A swarm can become a tool inside a delegate\n- A delegate can be a node inside a graph\n- And so on\n\nstrands-compose figures out the correct build order (inner systems first), wires everything up, and catches impossible topologies (like circular references) before anything runs.\n",
      "message": {
        "role": "assistant",
        "content": [
          {
            "text": "I already have the overview document loaded, which contains the orchestration concepts. Let me extract the relevant section for you:\n\nFrom the overview document, here are the three orchestration modes:\n\n## **Delegate** — Hub-and-spoke pattern\nOne coordinator agent treats other agents as tools it can call. The coordinator has explicit control over who does what and when.\n\n**When to use:** When you want a \"boss\" making decisions about task flow. Example: a manager agent that decides whether to route a request to a sales agent, support agent, or technical specialist.\n\n---\n\n## **Swarm** — Peer collaboration\nAgents hand control off to each other autonomously, with no central coordinator. They negotiate and collaborate directly.\n\n**When to use:** Negotiation-style loops like draft → review → revise. Example: a writer agent drafts content, a reviewer agent critiques it, and they iterate back and forth until satisfied — no central orchestrator directing them.\n\n---\n\n## **Graph** — Deterministic pipeline\nAgents run in a fixed dependency order (a DAG — directed acyclic graph), and independent steps can run in parallel.\n\n**When to use:** When you know the exact processing order upfront. Example: a data pipeline where one agent extracts data, another validates it, and a third transforms it — each step depends on the previous one.\n\n---\n\n## The key composition idea\n\nThese are not three separate products — they are **building blocks that click together**. You can nest them arbitrarily:\n- A swarm can become a tool inside a delegate\n- A delegate can be a node inside a graph\n- And so on\n\nstrands-compose figures out the correct build order (inner systems first), wires everything up, and catches impossible topologies (like circular references) before anything runs."
          }
        ],
        "metadata": {
          "usage": {
            "inputTokens": 3676,
            "outputTokens": 393,
            "totalTokens": 4069
          },
          "metrics": {
            "latencyMs": 4876,
            "timeToFirstByteMs": 780
          }
        },
        "tracking_id": "738cd9ed-a752-48f8-baec-9719c6e08087"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:36.987675+00:00",
    "data": {
      "tool_name": "doc_expert",
      "tool_label": "Delegating work to agent: Doc_Expert",
      "tool_use_id": "tooluse_7Li6OdRzvUsLzpYPtyyMxW",
      "status": "success",
      "error": null,
      "tool_result": "I already have the overview document loaded, which contains the orchestration concepts. Let me extract the relevant section for you:\n\nFrom the overview document, here are the three orchestration modes:\n\n## **Delegate** — Hub-and-spoke pattern\nOne coordinator agent treats other agents as tools it can call. The coordinator has explicit control over who does what and when.\n\n**When to use:** When you want a \"boss\" making decisions about task flow. Example: a manager agent that decides whether to route a request to a sales agent, support agent, or technical specialist.\n\n---\n\n## **Swarm** — Peer col..."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:37.861717+00:00",
    "data": {
      "text": "Let"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:37.876235+00:00",
    "data": {
      "text": " me ask"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:37.876631+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:37.894797+00:00",
    "data": {
      "text": " secon"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:37.917586+00:00",
    "data": {
      "text": "d question now"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:37.951663+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "tool_start",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:38.671733+00:00",
    "data": {
      "tool_name": "doc_expert",
      "tool_label": "Delegating work to agent: Doc_Expert",
      "tool_use_id": "tooluse_HzTo7UyZ5W222wXXcd4eiV",
      "tool_input": {
        "input": "What are the key technical building blocks in strands-compose? Explain tools, hooks, sessions, and the \"native objects\" idea in a way a beginner can understand."
      }
    }
  },
  {
    "type": "agent_start",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:38.672230+00:00",
    "data": {}
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.566630+00:00",
    "data": {
      "text": "Let"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.579925+00:00",
    "data": {
      "text": " me rea"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.581554+00:00",
    "data": {
      "text": "d the technical"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.668375+00:00",
    "data": {
      "text": " concepts"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.668767+00:00",
    "data": {
      "text": " "
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.669222+00:00",
    "data": {
      "text": "document to give"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.669918+00:00",
    "data": {
      "text": " you the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.684153+00:00",
    "data": {
      "text": " precise"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:39.770647+00:00",
    "data": {
      "text": " details:"
    }
  },
  {
    "type": "tool_start",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:40.182353+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_Ble6PEHDUbFyfeYX7shRsa",
      "tool_input": {
        "name": "02_technical_concepts.md"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:40.185307+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_Ble6PEHDUbFyfeYX7shRsa",
      "status": "success",
      "error": null,
      "tool_result": "# strands-compose — Technical Concepts\n\n*Conceptual doc for the \"how it actually works\" layer. Enough technical grounding to\nexplain mechanisms — but still concept-first, not a full field reference.*\n\n---\n\n## Custom tools — how agents get capabilities\n\nTools are plain Python functions decorated with strands' `@tool`. strands-compose discovers\nthem for you: point an agent at a file, a directory, or an installed module, and every\n`@tool`-decorated function becomes a capability the agent can call.\n\nKey mechanics worth knowing:\n\n- The function's **docstring becomes the tool description** the model..."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.209349+00:00",
    "data": {
      "text": "##"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.209570+00:00",
    "data": {
      "text": " Key"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.209599+00:00",
    "data": {
      "text": " Technical"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.209622+00:00",
    "data": {
      "text": " Building"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.210364+00:00",
    "data": {
      "text": " Blocks\n\n###"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.210505+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.210913+00:00",
    "data": {
      "text": "Tools"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.211626+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.212180+00:00",
    "data": {
      "text": " Agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.250328+00:00",
    "data": {
      "text": " capabilities"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.250595+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.251375+00:00",
    "data": {
      "text": "\n\nTools"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.252010+00:00",
    "data": {
      "text": " are plain"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.263739+00:00",
    "data": {
      "text": " Python functions"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.285837+00:00",
    "data": {
      "text": " decorate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.408152+00:00",
    "data": {
      "text": "d with str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.409646+00:00",
    "data": {
      "text": "ands'"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.410975+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.413244+00:00",
    "data": {
      "text": "@tool"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.413325+00:00",
    "data": {
      "text": "`."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.424091+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.446099+00:00",
    "data": {
      "text": "ands-compose discovers"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.510473+00:00",
    "data": {
      "text": " them"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.511586+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.513060+00:00",
    "data": {
      "text": "d gives"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.533425+00:00",
    "data": {
      "text": " agents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.613524+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.614057+00:00",
    "data": {
      "text": " ability"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.614150+00:00",
    "data": {
      "text": " to call"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.621173+00:00",
    "data": {
      "text": " them."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.644030+00:00",
    "data": {
      "text": "\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.714771+00:00",
    "data": {
      "text": "How"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.716122+00:00",
    "data": {
      "text": " it works:**\n- The"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.718456+00:00",
    "data": {
      "text": " function"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.739554+00:00",
    "data": {
      "text": "'s"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.817150+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.818109+00:00",
    "data": {
      "text": "docstring becomes"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.827394+00:00",
    "data": {
      "text": " the tool description"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:41.849849+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.022416+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.022830+00:00",
    "data": {
      "text": " model"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.023968+00:00",
    "data": {
      "text": " reads"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.026086+00:00",
    "data": {
      "text": "\n- **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.026426+00:00",
    "data": {
      "text": "Type"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.027554+00:00",
    "data": {
      "text": " hints become"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.027634+00:00",
    "data": {
      "text": " the parameter"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.028912+00:00",
    "data": {
      "text": " schema"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.047017+00:00",
    "data": {
      "text": "** —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.125216+00:00",
    "data": {
      "text": " goo"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.126658+00:00",
    "data": {
      "text": "d types"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.126949+00:00",
    "data": {
      "text": " directly"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.134870+00:00",
    "data": {
      "text": " improve"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.157086+00:00",
    "data": {
      "text": " how"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.226747+00:00",
    "data": {
      "text": " well"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.227262+00:00",
    "data": {
      "text": " the model"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.228629+00:00",
    "data": {
      "text": " uses"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.244945+00:00",
    "data": {
      "text": " the tool\n- File"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.286705+00:00",
    "data": {
      "text": " paths are"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.288473+00:00",
    "data": {
      "text": " resolve"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.328487+00:00",
    "data": {
      "text": "d **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.334002+00:00",
    "data": {
      "text": "relative to the config"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.430695+00:00",
    "data": {
      "text": " file**,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.432100+00:00",
    "data": {
      "text": " so"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.432134+00:00",
    "data": {
      "text": " configs"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.533314+00:00",
    "data": {
      "text": " work"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.533867+00:00",
    "data": {
      "text": " anywhere"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.534359+00:00",
    "data": {
      "text": "\n- Each"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.635981+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.636687+00:00",
    "data": {
      "text": " gets its"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.637097+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.638099+00:00",
    "data": {
      "text": "own independent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.640047+00:00",
    "data": {
      "text": " copy"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.640944+00:00",
    "data": {
      "text": "** of tools"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.737952+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.740046+00:00",
    "data": {
      "text": " no shared state between"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.740395+00:00",
    "data": {
      "text": " agents\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.840252+00:00",
    "data": {
      "text": "Beg"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.842653+00:00",
    "data": {
      "text": "inner way"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.842737+00:00",
    "data": {
      "text": " to think about it:**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.842795+00:00",
    "data": {
      "text": " Tools are like"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.843349+00:00",
    "data": {
      "text": " giving"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.845126+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.942645+00:00",
    "data": {
      "text": " agent a tool"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.943869+00:00",
    "data": {
      "text": "box."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.944249+00:00",
    "data": {
      "text": " The "
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.945852+00:00",
    "data": {
      "text": "docstring is the label"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:42.953918+00:00",
    "data": {
      "text": " on"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.044883+00:00",
    "data": {
      "text": " each"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.046122+00:00",
    "data": {
      "text": " tool, and the type hints tell"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.046204+00:00",
    "data": {
      "text": " the agent what kin"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.048312+00:00",
    "data": {
      "text": "d of inputs"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.147213+00:00",
    "data": {
      "text": " each"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.148320+00:00",
    "data": {
      "text": " tool accepts"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.150030+00:00",
    "data": {
      "text": ".\n\n---"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.150533+00:00",
    "data": {
      "text": "\n\n### **Hooks — Middleware"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.234622+00:00",
    "data": {
      "text": " for the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.235869+00:00",
    "data": {
      "text": " agent lifecycle"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.237056+00:00",
    "data": {
      "text": "**\n\nHooks are lifecycle"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.241327+00:00",
    "data": {
      "text": " callbacks"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.258761+00:00",
    "data": {
      "text": " that fire"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.280347+00:00",
    "data": {
      "text": " at"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.302281+00:00",
    "data": {
      "text": " define"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.324832+00:00",
    "data": {
      "text": "d points:"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.346498+00:00",
    "data": {
      "text": " before/"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.368574+00:00",
    "data": {
      "text": "after inv"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.390358+00:00",
    "data": {
      "text": "oc"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.413780+00:00",
    "data": {
      "text": "ations, before/after model"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.434520+00:00",
    "data": {
      "text": " calls, before/after tool"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.480627+00:00",
    "data": {
      "text": " calls, an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.486510+00:00",
    "data": {
      "text": "d before/after multi"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.509115+00:00",
    "data": {
      "text": "-agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.531484+00:00",
    "data": {
      "text": " operations"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.561292+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.583876+00:00",
    "data": {
      "text": " They're the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.607481+00:00",
    "data": {
      "text": " right"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.630324+00:00",
    "data": {
      "text": " place for"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.653165+00:00",
    "data": {
      "text": " cross"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.675292+00:00",
    "data": {
      "text": "-cutting concerns like"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.697056+00:00",
    "data": {
      "text": " guar"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.717886+00:00",
    "data": {
      "text": "drails, audit"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.746155+00:00",
    "data": {
      "text": " logging"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.761755+00:00",
    "data": {
      "text": ", cost"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.784267+00:00",
    "data": {
      "text": " tracking, an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.807484+00:00",
    "data": {
      "text": "d rate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.830365+00:00",
    "data": {
      "text": " limiting.\n\n**Key"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.850158+00:00",
    "data": {
      "text": " mechanics"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.871052+00:00",
    "data": {
      "text": ":**\n- A"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.893138+00:00",
    "data": {
      "text": " hook is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.916752+00:00",
    "data": {
      "text": " a class"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.937439+00:00",
    "data": {
      "text": " implementing"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.959042+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:43.998410+00:00",
    "data": {
      "text": "ands' `H"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.002553+00:00",
    "data": {
      "text": "ookProvider"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.025024+00:00",
    "data": {
      "text": "` interface\n- Hooks fire"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.125399+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.130239+00:00",
    "data": {
      "text": "in"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.131919+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.135781+00:00",
    "data": {
      "text": " order liste"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.137682+00:00",
    "data": {
      "text": "d** —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.158591+00:00",
    "data": {
      "text": " order"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.183252+00:00",
    "data": {
      "text": " matters when"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.211703+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.233549+00:00",
    "data": {
      "text": " depends"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.255758+00:00",
    "data": {
      "text": " on another\n- Each"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.277475+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.300484+00:00",
    "data": {
      "text": " gets **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.321967+00:00",
    "data": {
      "text": "fresh"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.343530+00:00",
    "data": {
      "text": " hook"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.367440+00:00",
    "data": {
      "text": " instances** —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.387549+00:00",
    "data": {
      "text": " two"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.409029+00:00",
    "data": {
      "text": " agents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.433535+00:00",
    "data": {
      "text": " don"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.453700+00:00",
    "data": {
      "text": "'t share hook"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.477246+00:00",
    "data": {
      "text": " state"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.505699+00:00",
    "data": {
      "text": "\n- Built"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.527712+00:00",
    "data": {
      "text": "-in hooks exist"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.549291+00:00",
    "data": {
      "text": " for common cases"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.571635+00:00",
    "data": {
      "text": ": c"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.593747+00:00",
    "data": {
      "text": "apping"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.615918+00:00",
    "data": {
      "text": " tool"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.664130+00:00",
    "data": {
      "text": " calls, sanit"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.666627+00:00",
    "data": {
      "text": "izing tool"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.681757+00:00",
    "data": {
      "text": " names"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.704328+00:00",
    "data": {
      "text": ", providing"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.725158+00:00",
    "data": {
      "text": " external"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.747603+00:00",
    "data": {
      "text": " stop"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.769064+00:00",
    "data": {
      "text": " signals\n\n**Beginner way to"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.822203+00:00",
    "data": {
      "text": " think about it:** Hooks are like"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.893861+00:00",
    "data": {
      "text": " observers"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.907044+00:00",
    "data": {
      "text": " watching"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.913217+00:00",
    "data": {
      "text": " the agent work"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.914930+00:00",
    "data": {
      "text": ". They can"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:44.918772+00:00",
    "data": {
      "text": " interc"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.008097+00:00",
    "data": {
      "text": "ept key"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.017742+00:00",
    "data": {
      "text": " moments and "
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.026041+00:00",
    "data": {
      "text": "do something"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.032145+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.033225+00:00",
    "data": {
      "text": "log"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.034642+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.054950+00:00",
    "data": {
      "text": ", check"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.075921+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.098321+00:00",
    "data": {
      "text": " safety"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.120594+00:00",
    "data": {
      "text": " rule"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.142368+00:00",
    "data": {
      "text": ", track"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.164533+00:00",
    "data": {
      "text": " costs)"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.186480+00:00",
    "data": {
      "text": " without"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.208547+00:00",
    "data": {
      "text": " changing the agent's core"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.230275+00:00",
    "data": {
      "text": " logic.\n\n---\n\n### **Sessions"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.251968+00:00",
    "data": {
      "text": " — Memory"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.273780+00:00",
    "data": {
      "text": " across"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.295873+00:00",
    "data": {
      "text": " turns an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.318416+00:00",
    "data": {
      "text": "d restarts**\n\nBy"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.341322+00:00",
    "data": {
      "text": " default, agents are stateless —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.362330+00:00",
    "data": {
      "text": " each run starts fresh. A session manager"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.384052+00:00",
    "data": {
      "text": " adds persistent conversation history across"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.406748+00:00",
    "data": {
      "text": " multiple"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.427899+00:00",
    "data": {
      "text": " turns."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.449757+00:00",
    "data": {
      "text": "\n\n**Key points"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.473959+00:00",
    "data": {
      "text": ":**\n- Can"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.493945+00:00",
    "data": {
      "text": " be set"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.539971+00:00",
    "data": {
      "text": " globally (every agent inherits it)"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.542358+00:00",
    "data": {
      "text": " or per agent\n- Agents can"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.559304+00:00",
    "data": {
      "text": " opt"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.591866+00:00",
    "data": {
      "text": " out if"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.613299+00:00",
    "data": {
      "text": " neede"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.635769+00:00",
    "data": {
      "text": "d\n-"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.657471+00:00",
    "data": {
      "text": " Backends include local filesystem, Amazon"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.679464+00:00",
    "data": {
      "text": " S3, and Bedrock Ag"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.701522+00:00",
    "data": {
      "text": "entCore Memory\n- **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.723067+00:00",
    "data": {
      "text": "Important"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.745198+00:00",
    "data": {
      "text": " constraint:** Agents in"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.767365+00:00",
    "data": {
      "text": " a swarm cannot use"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.789951+00:00",
    "data": {
      "text": " session"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.811447+00:00",
    "data": {
      "text": " managers"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.833685+00:00",
    "data": {
      "text": " (a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:45.865785+00:00",
    "data": {
      "text": " strands limitation)\n\n**Beg"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.197464+00:00",
    "data": {
      "text": "inner way to think about it:** Sessions"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.198695+00:00",
    "data": {
      "text": " are like a notebook"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.199747+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.199872+00:00",
    "data": {
      "text": " agent keeps"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.200399+00:00",
    "data": {
      "text": ". Between"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.200431+00:00",
    "data": {
      "text": " conversations"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.201000+00:00",
    "data": {
      "text": ", it can"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.201391+00:00",
    "data": {
      "text": " flip"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.201884+00:00",
    "data": {
      "text": " back"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.202213+00:00",
    "data": {
      "text": " through"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.202715+00:00",
    "data": {
      "text": " the notebook"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.203304+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.203947+00:00",
    "data": {
      "text": " remember"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.204282+00:00",
    "data": {
      "text": " what happened before"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.204738+00:00",
    "data": {
      "text": ".\n\n---\n\n### **The"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.223829+00:00",
    "data": {
      "text": " \""
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.236278+00:00",
    "data": {
      "text": "native"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.257823+00:00",
    "data": {
      "text": " objects"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.280618+00:00",
    "data": {
      "text": "\" idea"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.302267+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.324819+00:00",
    "data": {
      "text": " No"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.345968+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.368389+00:00",
    "data": {
      "text": "rap"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.391892+00:00",
    "data": {
      "text": "pers**\n\nThis"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.413522+00:00",
    "data": {
      "text": " is the most"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.434723+00:00",
    "data": {
      "text": " important concept"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.459564+00:00",
    "data": {
      "text": ". When"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.479792+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.501387+00:00",
    "data": {
      "text": "ands-compose builds"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.523858+00:00",
    "data": {
      "text": " your system"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.544641+00:00",
    "data": {
      "text": ", it does"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.566099+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.587623+00:00",
    "data": {
      "text": "two"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.610652+00:00",
    "data": {
      "text": " distinct"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.632258+00:00",
    "data": {
      "text": " steps"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.657421+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.676323+00:00",
    "data": {
      "text": ":\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.699096+00:00",
    "data": {
      "text": "1. Resolution"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.719711+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.745423+00:00",
    "data": {
      "text": " — turning"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.828558+00:00",
    "data": {
      "text": " YAML into objects"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.835762+00:00",
    "data": {
      "text": "\n-"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.835976+00:00",
    "data": {
      "text": " Interpolate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.853927+00:00",
    "data": {
      "text": " variables an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.875332+00:00",
    "data": {
      "text": "d expan"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.922597+00:00",
    "data": {
      "text": "d YAML anch"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:46.945159+00:00",
    "data": {
      "text": "ors\n- Validate the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.011013+00:00",
    "data": {
      "text": " structure"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.038421+00:00",
    "data": {
      "text": "\n- Start M"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.059905+00:00",
    "data": {
      "text": "CP servers an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.082099+00:00",
    "data": {
      "text": "d create"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.104154+00:00",
    "data": {
      "text": " M"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.127530+00:00",
    "data": {
      "text": "CP clients\n- Buil"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.150796+00:00",
    "data": {
      "text": "d agents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.171682+00:00",
    "data": {
      "text": " with"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.193716+00:00",
    "data": {
      "text": " their models"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.272502+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.274968+00:00",
    "data": {
      "text": " tools, hooks"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.275948+00:00",
    "data": {
      "text": ", and session"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.289165+00:00",
    "data": {
      "text": " managers"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.341125+00:00",
    "data": {
      "text": "\n- Result"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.363831+00:00",
    "data": {
      "text": ": a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.386612+00:00",
    "data": {
      "text": " bag"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.409026+00:00",
    "data": {
      "text": " of native strands objects\n\n**2"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.430591+00:00",
    "data": {
      "text": ". Wiring** — connecting those"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.452757+00:00",
    "data": {
      "text": " parts"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.474616+00:00",
    "data": {
      "text": " into"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.497209+00:00",
    "data": {
      "text": " one coher"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.518770+00:00",
    "data": {
      "text": "ent system\n- Agents become"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.540225+00:00",
    "data": {
      "text": " each"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.586338+00:00",
    "data": {
      "text": " other's capabilities"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.587644+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.605795+00:00",
    "data": {
      "text": "tools in"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.628857+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.650303+00:00",
    "data": {
      "text": " delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.672588+00:00",
    "data": {
      "text": ", nodes"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.694394+00:00",
    "data": {
      "text": " in a graph"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.716150+00:00",
    "data": {
      "text": "/"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.749067+00:00",
    "data": {
      "text": "sw"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.760042+00:00",
    "data": {
      "text": "arm)\n- MCP clients are"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.781754+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.804410+00:00",
    "data": {
      "text": "ired to agents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.826770+00:00",
    "data": {
      "text": " as"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.848802+00:00",
    "data": {
      "text": " tool"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.870207+00:00",
    "data": {
      "text": " providers\n- **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.892158+00:00",
    "data": {
      "text": "The"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.913958+00:00",
    "data": {
      "text": " event"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.935809+00:00",
    "data": {
      "text": " stream is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.957679+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:47.979537+00:00",
    "data": {
      "text": "ired across"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.001755+00:00",
    "data": {
      "text": " everything"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.023531+00:00",
    "data": {
      "text": "** — one"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.045110+00:00",
    "data": {
      "text": " publisher"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.067438+00:00",
    "data": {
      "text": " thre"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.088869+00:00",
    "data": {
      "text": "aded into"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.111396+00:00",
    "data": {
      "text": " every"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.137662+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.179786+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.180712+00:00",
    "data": {
      "text": "d orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.198805+00:00",
    "data": {
      "text": "rator,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.221203+00:00",
    "data": {
      "text": " f"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.243706+00:00",
    "data": {
      "text": "unn"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.282201+00:00",
    "data": {
      "text": "eling all"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.286958+00:00",
    "data": {
      "text": " events into"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.308743+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.331845+00:00",
    "data": {
      "text": " unifie"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.352715+00:00",
    "data": {
      "text": "d stream"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.374357+00:00",
    "data": {
      "text": "\n- Result: one"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.396236+00:00",
    "data": {
      "text": " entry"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.418791+00:00",
    "data": {
      "text": " point to"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.440519+00:00",
    "data": {
      "text": " run"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.471737+00:00",
    "data": {
      "text": " the whole connecte"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.493560+00:00",
    "data": {
      "text": "d system\n\n**The"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.515302+00:00",
    "data": {
      "text": " key"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.538057+00:00",
    "data": {
      "text": " insight:** After"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.559861+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.582041+00:00",
    "data": {
      "text": "iring, what"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.604664+00:00",
    "data": {
      "text": " you"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.633140+00:00",
    "data": {
      "text": " hol"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.654522+00:00",
    "data": {
      "text": "d are"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.672554+00:00",
    "data": {
      "text": " **real"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.694427+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.716476+00:00",
    "data": {
      "text": " native"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.747130+00:00",
    "data": {
      "text": " strands objects** —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.773605+00:00",
    "data": {
      "text": " not wrapped,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.790420+00:00",
    "data": {
      "text": " not prox"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.812145+00:00",
    "data": {
      "text": "ied, not hidden"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.834087+00:00",
    "data": {
      "text": " behind a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.856401+00:00",
    "data": {
      "text": " framework"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.878300+00:00",
    "data": {
      "text": ". Nothing"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.899889+00:00",
    "data": {
      "text": " interc"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.923148+00:00",
    "data": {
      "text": "epts calls"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.943880+00:00",
    "data": {
      "text": " at"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.965791+00:00",
    "data": {
      "text": " runtime"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:48.987595+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.009712+00:00",
    "data": {
      "text": " The"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.031614+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.053521+00:00",
    "data": {
      "text": "iring is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.077793+00:00",
    "data": {
      "text": " structural"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.100095+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.122049+00:00",
    "data": {
      "text": "who"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.144288+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.191863+00:00",
    "data": {
      "text": " connected to whom),"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.192475+00:00",
    "data": {
      "text": " not a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.212566+00:00",
    "data": {
      "text": " proxy layer"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.235054+00:00",
    "data": {
      "text": ".\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.256706+00:00",
    "data": {
      "text": "Beginner way to think about it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.279828+00:00",
    "data": {
      "text": ":** str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.301141+00:00",
    "data": {
      "text": "ands-compose is like a construction"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.335435+00:00",
    "data": {
      "text": " crew. It builds the parts"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.344892+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.375171+00:00",
    "data": {
      "text": "agents"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.392065+00:00",
    "data": {
      "text": ", tools"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.414285+00:00",
    "data": {
      "text": ", hooks"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.436775+00:00",
    "data": {
      "text": "),"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.467960+00:00",
    "data": {
      "text": " connects"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.487495+00:00",
    "data": {
      "text": " them together"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.510041+00:00",
    "data": {
      "text": " (w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.540258+00:00",
    "data": {
      "text": "iring"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.562099+00:00",
    "data": {
      "text": "), and then leaves"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.584023+00:00",
    "data": {
      "text": " the site"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.605585+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.629949+00:00",
    "data": {
      "text": " What"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.656444+00:00",
    "data": {
      "text": " you're"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.674146+00:00",
    "data": {
      "text": " left"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.695834+00:00",
    "data": {
      "text": " with is a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.719063+00:00",
    "data": {
      "text": " real"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.753550+00:00",
    "data": {
      "text": ", working"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.762680+00:00",
    "data": {
      "text": " system made"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.805698+00:00",
    "data": {
      "text": " of standar"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.816180+00:00",
    "data": {
      "text": "d strands pieces"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.837031+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.858723+00:00",
    "data": {
      "text": " You"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.884648+00:00",
    "data": {
      "text": " can inspect"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.911074+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.932944+00:00",
    "data": {
      "text": ", call"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.954939+00:00",
    "data": {
      "text": " it, exten"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.977149+00:00",
    "data": {
      "text": "d it —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:49.999178+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.021176+00:00",
    "data": {
      "text": " beh"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.043418+00:00",
    "data": {
      "text": "aves exactly"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.065138+00:00",
    "data": {
      "text": " like"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.086878+00:00",
    "data": {
      "text": " the str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.109458+00:00",
    "data": {
      "text": "ands docs"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.131536+00:00",
    "data": {
      "text": " say because"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.153487+00:00",
    "data": {
      "text": " it *"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.175802+00:00",
    "data": {
      "text": "is* str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.197211+00:00",
    "data": {
      "text": "ands."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.218592+00:00",
    "data": {
      "text": "\n\n---\n\n###"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.240668+00:00",
    "data": {
      "text": " **Stream"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.262510+00:00",
    "data": {
      "text": " events"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.284714+00:00",
    "data": {
      "text": " — The"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.306661+00:00",
    "data": {
      "text": " observ"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.328483+00:00",
    "data": {
      "text": "ability layer"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.350469+00:00",
    "data": {
      "text": "**\n\nOne"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.372593+00:00",
    "data": {
      "text": " call"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.398559+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.417195+00:00",
    "data": {
      "text": "ires an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.439234+00:00",
    "data": {
      "text": " event publisher"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.468661+00:00",
    "data": {
      "text": " into **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.490905+00:00",
    "data": {
      "text": "every agent and every"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.513642+00:00",
    "data": {
      "text": " orchestrator**"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.538610+00:00",
    "data": {
      "text": " across"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.559301+00:00",
    "data": {
      "text": " the entire system,"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.581008+00:00",
    "data": {
      "text": " no"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.602702+00:00",
    "data": {
      "text": " matter how deep"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.625093+00:00",
    "data": {
      "text": " or"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.648191+00:00",
    "data": {
      "text": " complex. All"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.669104+00:00",
    "data": {
      "text": " events fun"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.691149+00:00",
    "data": {
      "text": "nel into"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.712592+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.735523+00:00",
    "data": {
      "text": " unifie"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.757477+00:00",
    "data": {
      "text": "d stream.\n\n**Event"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.779074+00:00",
    "data": {
      "text": " structure:**\n- Every"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.801264+00:00",
    "data": {
      "text": " event"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.823093+00:00",
    "data": {
      "text": " has four"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.845043+00:00",
    "data": {
      "text": " fields: **"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.867042+00:00",
    "data": {
      "text": "type**, **agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.888683+00:00",
    "data": {
      "text": " name"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.910607+00:00",
    "data": {
      "text": "**, **timestamp"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.932653+00:00",
    "data": {
      "text": "**, **data payloa"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.954303+00:00",
    "data": {
      "text": "d**\n- Single"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:50.976018+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.159270+00:00",
    "data": {
      "text": "agent events: agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.160162+00:00",
    "data": {
      "text": " starte"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.160285+00:00",
    "data": {
      "text": "d, token"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.160772+00:00",
    "data": {
      "text": " generate"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.161057+00:00",
    "data": {
      "text": "d, model reasoning"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.161495+00:00",
    "data": {
      "text": ", tool calls"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.162107+00:00",
    "data": {
      "text": ", completion"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.162139+00:00",
    "data": {
      "text": "\n- Multi-agent events: orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.173728+00:00",
    "data": {
      "text": "ration"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.196678+00:00",
    "data": {
      "text": " starting"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.237085+00:00",
    "data": {
      "text": "/"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.239267+00:00",
    "data": {
      "text": "stopping, node"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.261959+00:00",
    "data": {
      "text": " transitions"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.295676+00:00",
    "data": {
      "text": ", han"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.305526+00:00",
    "data": {
      "text": "doffs"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.327724+00:00",
    "data": {
      "text": " between"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.369835+00:00",
    "data": {
      "text": " peers"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.371441+00:00",
    "data": {
      "text": "\n- Session"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.393201+00:00",
    "data": {
      "text": " events: bracket"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.417187+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.437612+00:00",
    "data": {
      "text": " whole"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.462247+00:00",
    "data": {
      "text": " turn"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.484189+00:00",
    "data": {
      "text": " with"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.508166+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.557776+00:00",
    "data": {
      "text": " topology"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.588955+00:00",
    "data": {
      "text": " manifest"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.608584+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.630964+00:00",
    "data": {
      "text": "d final"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.652889+00:00",
    "data": {
      "text": " response"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.697948+00:00",
    "data": {
      "text": "\n\n**Beginner way to think"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.698759+00:00",
    "data": {
      "text": " about it:** It"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.718200+00:00",
    "data": {
      "text": "'s like having"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.740634+00:00",
    "data": {
      "text": " a camera"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.771381+00:00",
    "data": {
      "text": " recording"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.794755+00:00",
    "data": {
      "text": " every"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.831916+00:00",
    "data": {
      "text": " move the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.894903+00:00",
    "data": {
      "text": " entire"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.895806+00:00",
    "data": {
      "text": " system makes. You see"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.900041+00:00",
    "data": {
      "text": " which"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.919074+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.960273+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.972662+00:00",
    "data": {
      "text": " working"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:51.995564+00:00",
    "data": {
      "text": ", what"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.018716+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.039013+00:00",
    "data": {
      "text": "'s thinking"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.062453+00:00",
    "data": {
      "text": ", what tools"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.091693+00:00",
    "data": {
      "text": " it's calling"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.113307+00:00",
    "data": {
      "text": ", when"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.135306+00:00",
    "data": {
      "text": " it hands"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.157799+00:00",
    "data": {
      "text": " off to"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.181721+00:00",
    "data": {
      "text": " another"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.204808+00:00",
    "data": {
      "text": " agent —"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.227871+00:00",
    "data": {
      "text": " all"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.250475+00:00",
    "data": {
      "text": " in one ordere"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.329580+00:00",
    "data": {
      "text": "d stream."
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.393540+00:00",
    "data": {
      "text": " An"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.397910+00:00",
    "data": {
      "text": "d because"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.409680+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.415460+00:00",
    "data": {
      "text": "ands-compose already"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.418814+00:00",
    "data": {
      "text": " knows"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.421295+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.435338+00:00",
    "data": {
      "text": " full"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.451349+00:00",
    "data": {
      "text": " shape"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.473650+00:00",
    "data": {
      "text": " of your"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.495639+00:00",
    "data": {
      "text": " system, it can automatically"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.517972+00:00",
    "data": {
      "text": " wire this"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.548246+00:00",
    "data": {
      "text": " camera"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.570531+00:00",
    "data": {
      "text": " into every"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.592536+00:00",
    "data": {
      "text": " part"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.614961+00:00",
    "data": {
      "text": " without"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.655555+00:00",
    "data": {
      "text": " you having to write"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.667558+00:00",
    "data": {
      "text": " topology"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.689658+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.711127+00:00",
    "data": {
      "text": "specific"
    }
  },
  {
    "type": "token",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.745234+00:00",
    "data": {
      "text": " code."
    }
  },
  {
    "type": "agent_complete",
    "agent_name": "doc_expert",
    "timestamp": "2026-07-12T00:47:52.829356+00:00",
    "data": {
      "usage": {
        "input_tokens": 10611,
        "output_tokens": 1192,
        "total_tokens": 11803
      },
      "text": "## Key Technical Building Blocks\n\n### **Tools — Agent capabilities**\n\nTools are plain Python functions decorated with strands' `@tool`. strands-compose discovers them and gives agents the ability to call them.\n\n**How it works:**\n- The function's **docstring becomes the tool description** the model reads\n- **Type hints become the parameter schema** — good types directly improve how well the model uses the tool\n- File paths are resolved **relative to the config file**, so configs work anywhere\n- Each agent gets its **own independent copy** of tools — no shared state between agents\n\n**Beginner way to think about it:** Tools are like giving an agent a toolbox. The docstring is the label on each tool, and the type hints tell the agent what kind of inputs each tool accepts.\n\n---\n\n### **Hooks — Middleware for the agent lifecycle**\n\nHooks are lifecycle callbacks that fire at defined points: before/after invocations, before/after model calls, before/after tool calls, and before/after multi-agent operations. They're the right place for cross-cutting concerns like guardrails, audit logging, cost tracking, and rate limiting.\n\n**Key mechanics:**\n- A hook is a class implementing strands' `HookProvider` interface\n- Hooks fire **in the order listed** — order matters when one depends on another\n- Each agent gets **fresh hook instances** — two agents don't share hook state\n- Built-in hooks exist for common cases: capping tool calls, sanitizing tool names, providing external stop signals\n\n**Beginner way to think about it:** Hooks are like observers watching the agent work. They can intercept key moments and do something (log it, check a safety rule, track costs) without changing the agent's core logic.\n\n---\n\n### **Sessions — Memory across turns and restarts**\n\nBy default, agents are stateless — each run starts fresh. A session manager adds persistent conversation history across multiple turns.\n\n**Key points:**\n- Can be set globally (every agent inherits it) or per agent\n- Agents can opt out if needed\n- Backends include local filesystem, Amazon S3, and Bedrock AgentCore Memory\n- **Important constraint:** Agents in a swarm cannot use session managers (a strands limitation)\n\n**Beginner way to think about it:** Sessions are like a notebook the agent keeps. Between conversations, it can flip back through the notebook to remember what happened before.\n\n---\n\n### **The \"native objects\" idea — No wrappers**\n\nThis is the most important concept. When strands-compose builds your system, it does **two distinct steps**:\n\n**1. Resolution** — turning YAML into objects\n- Interpolate variables and expand YAML anchors\n- Validate the structure\n- Start MCP servers and create MCP clients\n- Build agents with their models, tools, hooks, and session managers\n- Result: a bag of native strands objects\n\n**2. Wiring** — connecting those parts into one coherent system\n- Agents become each other's capabilities (tools in a delegate, nodes in a graph/swarm)\n- MCP clients are wired to agents as tool providers\n- **The event stream is wired across everything** — one publisher threaded into every agent and orchestrator, funneling all events into one unified stream\n- Result: one entry point to run the whole connected system\n\n**The key insight:** After wiring, what you hold are **real, native strands objects** — not wrapped, not proxied, not hidden behind a framework. Nothing intercepts calls at runtime. The wiring is structural (who is connected to whom), not a proxy layer.\n\n**Beginner way to think about it:** strands-compose is like a construction crew. It builds the parts (agents, tools, hooks), connects them together (wiring), and then leaves the site. What you're left with is a real, working system made of standard strands pieces. You can inspect it, call it, extend it — it behaves exactly like the strands docs say because it *is* strands.\n\n---\n\n### **Stream events — The observability layer**\n\nOne call wires an event publisher into **every agent and every orchestrator** across the entire system, no matter how deep or complex. All events funnel into one unified stream.\n\n**Event structure:**\n- Every event has four fields: **type**, **agent name**, **timestamp**, **data payload**\n- Single-agent events: agent started, token generated, model reasoning, tool calls, completion\n- Multi-agent events: orchestration starting/stopping, node transitions, handoffs between peers\n- Session events: bracket a whole turn with a topology manifest and final response\n\n**Beginner way to think about it:** It's like having a camera recording every move the entire system makes. You see which agent is working, what it's thinking, what tools it's calling, when it hands off to another agent — all in one ordered stream. And because strands-compose already knows the full shape of your system, it can automatically wire this camera into every part without you having to write topology-specific code.\n",
      "message": {
        "role": "assistant",
        "content": [
          {
            "text": "## Key Technical Building Blocks\n\n### **Tools — Agent capabilities**\n\nTools are plain Python functions decorated with strands' `@tool`. strands-compose discovers them and gives agents the ability to call them.\n\n**How it works:**\n- The function's **docstring becomes the tool description** the model reads\n- **Type hints become the parameter schema** — good types directly improve how well the model uses the tool\n- File paths are resolved **relative to the config file**, so configs work anywhere\n- Each agent gets its **own independent copy** of tools — no shared state between agents\n\n**Beginner way to think about it:** Tools are like giving an agent a toolbox. The docstring is the label on each tool, and the type hints tell the agent what kind of inputs each tool accepts.\n\n---\n\n### **Hooks — Middleware for the agent lifecycle**\n\nHooks are lifecycle callbacks that fire at defined points: before/after invocations, before/after model calls, before/after tool calls, and before/after multi-agent operations. They're the right place for cross-cutting concerns like guardrails, audit logging, cost tracking, and rate limiting.\n\n**Key mechanics:**\n- A hook is a class implementing strands' `HookProvider` interface\n- Hooks fire **in the order listed** — order matters when one depends on another\n- Each agent gets **fresh hook instances** — two agents don't share hook state\n- Built-in hooks exist for common cases: capping tool calls, sanitizing tool names, providing external stop signals\n\n**Beginner way to think about it:** Hooks are like observers watching the agent work. They can intercept key moments and do something (log it, check a safety rule, track costs) without changing the agent's core logic.\n\n---\n\n### **Sessions — Memory across turns and restarts**\n\nBy default, agents are stateless — each run starts fresh. A session manager adds persistent conversation history across multiple turns.\n\n**Key points:**\n- Can be set globally (every agent inherits it) or per agent\n- Agents can opt out if needed\n- Backends include local filesystem, Amazon S3, and Bedrock AgentCore Memory\n- **Important constraint:** Agents in a swarm cannot use session managers (a strands limitation)\n\n**Beginner way to think about it:** Sessions are like a notebook the agent keeps. Between conversations, it can flip back through the notebook to remember what happened before.\n\n---\n\n### **The \"native objects\" idea — No wrappers**\n\nThis is the most important concept. When strands-compose builds your system, it does **two distinct steps**:\n\n**1. Resolution** — turning YAML into objects\n- Interpolate variables and expand YAML anchors\n- Validate the structure\n- Start MCP servers and create MCP clients\n- Build agents with their models, tools, hooks, and session managers\n- Result: a bag of native strands objects\n\n**2. Wiring** — connecting those parts into one coherent system\n- Agents become each other's capabilities (tools in a delegate, nodes in a graph/swarm)\n- MCP clients are wired to agents as tool providers\n- **The event stream is wired across everything** — one publisher threaded into every agent and orchestrator, funneling all events into one unified stream\n- Result: one entry point to run the whole connected system\n\n**The key insight:** After wiring, what you hold are **real, native strands objects** — not wrapped, not proxied, not hidden behind a framework. Nothing intercepts calls at runtime. The wiring is structural (who is connected to whom), not a proxy layer.\n\n**Beginner way to think about it:** strands-compose is like a construction crew. It builds the parts (agents, tools, hooks), connects them together (wiring), and then leaves the site. What you're left with is a real, working system made of standard strands pieces. You can inspect it, call it, extend it — it behaves exactly like the strands docs say because it *is* strands.\n\n---\n\n### **Stream events — The observability layer**\n\nOne call wires an event publisher into **every agent and every orchestrator** across the entire system, no matter how deep or complex. All events funnel into one unified stream.\n\n**Event structure:**\n- Every event has four fields: **type**, **agent name**, **timestamp**, **data payload**\n- Single-agent events: agent started, token generated, model reasoning, tool calls, completion\n- Multi-agent events: orchestration starting/stopping, node transitions, handoffs between peers\n- Session events: bracket a whole turn with a topology manifest and final response\n\n**Beginner way to think about it:** It's like having a camera recording every move the entire system makes. You see which agent is working, what it's thinking, what tools it's calling, when it hands off to another agent — all in one ordered stream. And because strands-compose already knows the full shape of your system, it can automatically wire this camera into every part without you having to write topology-specific code."
          }
        ],
        "metadata": {
          "usage": {
            "inputTokens": 6502,
            "outputTokens": 1118,
            "totalTokens": 7620
          },
          "metrics": {
            "latencyMs": 12554,
            "timeToFirstByteMs": 1021
          }
        },
        "tracking_id": "b5e20f84-63d3-4bde-84be-f724bf30bf6d"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:52.829530+00:00",
    "data": {
      "tool_name": "doc_expert",
      "tool_label": "Delegating work to agent: Doc_Expert",
      "tool_use_id": "tooluse_HzTo7UyZ5W222wXXcd4eiV",
      "status": "success",
      "error": null,
      "tool_result": "## Key Technical Building Blocks\n\n### **Tools — Agent capabilities**\n\nTools are plain Python functions decorated with strands' `@tool`. strands-compose discovers them and gives agents the ability to call them.\n\n**How it works:**\n- The function's **docstring becomes the tool description** the model reads\n- **Type hints become the parameter schema** — good types directly improve how well the model uses the tool\n- File paths are resolved **relative to the config file**, so configs work anywhere\n- Each agent gets its **own independent copy** of tools — no shared state between agents\n\n**Beginner wa..."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.597614+00:00",
    "data": {
      "text": "Excellent."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.621328+00:00",
    "data": {
      "text": " Now let"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.622618+00:00",
    "data": {
      "text": " me get"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.646592+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.664349+00:00",
    "data": {
      "text": " concrete"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.685773+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.708367+00:00",
    "data": {
      "text": " non"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.729705+00:00",
    "data": {
      "text": "-triv"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.751666+00:00",
    "data": {
      "text": "ial example that"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.773647+00:00",
    "data": {
      "text": " showc"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.796090+00:00",
    "data": {
      "text": "ases real"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.817210+00:00",
    "data": {
      "text": " usage"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:53.839470+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "tool_start",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:47:55.163942+00:00",
    "data": {
      "tool_name": "developer",
      "tool_label": "Delegating work to agent: Developer",
      "tool_use_id": "tooluse_sI9ztG47yamlqCa2QVusZb",
      "tool_input": {
        "input": "Give me a SHORT, ESSENTIAL example of strands-compose in action. Show a delegate orchestration with two agents (a coordinator and a specialist), where the coordinator has one custom tool, and the specialist has another. Include the complete config.yaml and any Python files needed. Keep it minimal and fast to read — just enough to show how simple the wiring is."
      }
    }
  },
  {
    "type": "agent_start",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.164438+00:00",
    "data": {}
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.835820+00:00",
    "data": {
      "text": "I"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.836317+00:00",
    "data": {
      "text": "'ll start"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.837676+00:00",
    "data": {
      "text": " by"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.838830+00:00",
    "data": {
      "text": " exploring"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.937023+00:00",
    "data": {
      "text": " the reference"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.937690+00:00",
    "data": {
      "text": " material to understand delegates"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.938642+00:00",
    "data": {
      "text": ", agents"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.938910+00:00",
    "data": {
      "text": ", tools"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.938974+00:00",
    "data": {
      "text": ", and orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.941056+00:00",
    "data": {
      "text": "rations"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:55.941134+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "tool_start",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:56.244019+00:00",
    "data": {
      "tool_name": "list_docs",
      "tool_label": "list_docs",
      "tool_use_id": "tooluse_7hObIBbK5FffWCwjuFdimy",
      "tool_input": {}
    }
  },
  {
    "type": "tool_end",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:56.248123+00:00",
    "data": {
      "tool_name": "list_docs",
      "tool_label": "list_docs",
      "tool_use_id": "tooluse_7hObIBbK5FffWCwjuFdimy",
      "status": "success",
      "error": null,
      "tool_result": "{\"guides\": [{\"name\": \"configuration/Chapter_01.md\", \"title\": \"Chapter 1: The Basics — Your First Config\"}, {\"name\": \"configuration/Chapter_02.md\", \"title\": \"Chapter 2: Models — Choosing Your LLM\"}, {\"name\": \"configuration/Chapter_03.md\", \"title\": \"Chapter 3: Variables — Environment-Driven Config\"}, {\"name\": \"configuration/Chapter_04.md\", \"title\": \"Chapter 4: YAML Anchors — DRY Config Blocks\"}, {\"name\": \"configuration/Chapter_05.md\", \"title\": \"Chapter 5: Tools — Giving Agents Superpowers\"}, {\"name\": \"configuration/Chapter_06.md\", \"title\": \"Chapter 6: Hooks — Middleware for Agents\"}, {\"name\": \"c..."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.165684+00:00",
    "data": {
      "text": "Perfect"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.166384+00:00",
    "data": {
      "text": "! I can"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.167867+00:00",
    "data": {
      "text": " see there"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.167944+00:00",
    "data": {
      "text": "'s an"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.170445+00:00",
    "data": {
      "text": " example"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.170480+00:00",
    "data": {
      "text": " specifically"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.191853+00:00",
    "data": {
      "text": " for delegates"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.251065+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.251488+00:00",
    "data": {
      "text": "07"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.253193+00:00",
    "data": {
      "text": "_"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.273798+00:00",
    "data": {
      "text": "delegate) an"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.368855+00:00",
    "data": {
      "text": "d a chapter"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.369136+00:00",
    "data": {
      "text": " on"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.369517+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.370251+00:00",
    "data": {
      "text": "rations"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.391390+00:00",
    "data": {
      "text": " (Chapter"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.471094+00:00",
    "data": {
      "text": " "
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.471717+00:00",
    "data": {
      "text": "10). Let me rea"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.471857+00:00",
    "data": {
      "text": "d those"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.574834+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.575888+00:00",
    "data": {
      "text": " understand the exact"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.576068+00:00",
    "data": {
      "text": " syntax"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.576098+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "tool_start",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.954743+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_0dDeuHqeCECT5eyv3YhsuL",
      "tool_input": {
        "name": "examples/07_delegate"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:57.959015+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_0dDeuHqeCECT5eyv3YhsuL",
      "status": "success",
      "error": null,
      "tool_result": "# Example: examples/07_delegate\n\n\n===== README.md =====\n# 07 — Delegate (Multi-Agent Coordination)\n\n> One agent calls others as tools — research, write, done.\n\n## What this shows\n\n- `mode: delegate` in `orchestrations:` — turns sub-agents into callable tools\n- `entry_name:` — explicitly names the coordinator agent whose blueprint is used\n- `connections:` — a flat list of child agents, each with a `description:` the\n  coordinator sees when deciding which tool to call\n- The simplest multi-agent pattern: a coordinator that delegates, never writes itself\n\n## How it works\n\nDefine your agents normal..."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.006815+00:00",
    "data": {
      "text": "Great"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.023371+00:00",
    "data": {
      "text": "! Now"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.025066+00:00",
    "data": {
      "text": " let"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.108193+00:00",
    "data": {
      "text": " me rea"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.109075+00:00",
    "data": {
      "text": "d Chapter"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.109413+00:00",
    "data": {
      "text": " 5"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.109546+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.110114+00:00",
    "data": {
      "text": "Tools"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.114363+00:00",
    "data": {
      "text": ") to"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.144361+00:00",
    "data": {
      "text": " understand how"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.210667+00:00",
    "data": {
      "text": " to ad"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.210866+00:00",
    "data": {
      "text": "d custom"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.211318+00:00",
    "data": {
      "text": " tools to"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.225242+00:00",
    "data": {
      "text": " agents"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.247631+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "tool_start",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.690592+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_fa6HKQwyo03CRoxyQxLUyk",
      "tool_input": {
        "name": "configuration/Chapter_05.md"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:47:59.691779+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_fa6HKQwyo03CRoxyQxLUyk",
      "status": "success",
      "error": null,
      "tool_result": "# Chapter 5: Tools — Giving Agents Superpowers\n\n[← Back to Table of Contents](README.md) | [← Previous: YAML Anchors](Chapter_04.md)\n\n---\n\nThe `tools` field on an agent is a list of spec strings that tell strands-compose where to find Python tool functions.\n\n```yaml\nagents:\n  analyst:\n    model: default\n    tools:\n      - ./tools.py                          # All @tool functions from this file\n      - ./tools.py:count_words              # One specific function\n      - ./utils/                            # All @tool functions from all .py files in dir\n      - my_package.tools                   ..."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.746195+00:00",
    "data": {
      "text": "Perfect"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.746691+00:00",
    "data": {
      "text": "! Now"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.747065+00:00",
    "data": {
      "text": " let"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.761887+00:00",
    "data": {
      "text": " me check"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.784149+00:00",
    "data": {
      "text": " the examples"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.848409+00:00",
    "data": {
      "text": "/"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.849648+00:00",
    "data": {
      "text": "03"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.862032+00:00",
    "data": {
      "text": "_tools"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.882816+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.950857+00:00",
    "data": {
      "text": " see a"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.951593+00:00",
    "data": {
      "text": " concrete"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:00.951943+00:00",
    "data": {
      "text": " example of how tools"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:01.026228+00:00",
    "data": {
      "text": " are structure"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:01.026670+00:00",
    "data": {
      "text": "d."
    }
  },
  {
    "type": "tool_start",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:01.282963+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_5heyEcBVvoOQOLLFLEvEH5",
      "tool_input": {
        "name": "examples/03_tools"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:01.284611+00:00",
    "data": {
      "tool_name": "read_doc",
      "tool_label": "read_doc",
      "tool_use_id": "tooluse_5heyEcBVvoOQOLLFLEvEH5",
      "status": "success",
      "error": null,
      "tool_result": "# Example: examples/03_tools\n\n\n===== README.md =====\n# 03 — Python Tools\n\n> Give an agent Python functions as tools — YAML references your code directly.\n\n## What this shows\n\nThe `tools:` key in an agent config lets you point at your Python code.\nstrands-compose loads it and registers matching functions with the agent.\n\n## How it works\n\nAdd a `tools:` list to any agent definition. Each entry is a tool spec string — a path to\na file, a directory, or a Python module.\n\n```yaml\nagents:\n  analyst:\n    tools:\n      - ./tools.py          # all @tool functions from a file\n```\n\nSupported tool spec form..."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.281839+00:00",
    "data": {
      "text": "Perfect"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.282786+00:00",
    "data": {
      "text": "! Now"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.283891+00:00",
    "data": {
      "text": " I have everything"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.290226+00:00",
    "data": {
      "text": " I need."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.312334+00:00",
    "data": {
      "text": " Let me create a"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.383123+00:00",
    "data": {
      "text": " SHORT"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.383424+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.385445+00:00",
    "data": {
      "text": " ESSENTIAL"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.407447+00:00",
    "data": {
      "text": " example"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.485272+00:00",
    "data": {
      "text": " that combines"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.485809+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.497631+00:00",
    "data": {
      "text": "\n-"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.519805+00:00",
    "data": {
      "text": " A"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.587571+00:00",
    "data": {
      "text": " delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.588242+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.588933+00:00",
    "data": {
      "text": "ration"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.692554+00:00",
    "data": {
      "text": " with"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.693281+00:00",
    "data": {
      "text": " two"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.693960+00:00",
    "data": {
      "text": " agents"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.694296+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.792394+00:00",
    "data": {
      "text": "coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.997691+00:00",
    "data": {
      "text": " and specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:02.998202+00:00",
    "data": {
      "text": ")\n- The"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.000369+00:00",
    "data": {
      "text": " coordinator has"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.000723+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.002398+00:00",
    "data": {
      "text": " custom"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.002730+00:00",
    "data": {
      "text": " tool"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.003659+00:00",
    "data": {
      "text": "\n- The specialist has another"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.004719+00:00",
    "data": {
      "text": " custom tool\n-"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.100306+00:00",
    "data": {
      "text": " Minimal"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.100402+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.100472+00:00",
    "data": {
      "text": " fast"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.102238+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.104076+00:00",
    "data": {
      "text": " rea"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.104429+00:00",
    "data": {
      "text": "d"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.202058+00:00",
    "data": {
      "text": "\n\nHere"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.202753+00:00",
    "data": {
      "text": "'s the"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.203212+00:00",
    "data": {
      "text": " example"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.204267+00:00",
    "data": {
      "text": ":\n\n---"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.205709+00:00",
    "data": {
      "text": "\n\n##"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.219109+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.266787+00:00",
    "data": {
      "text": "Delegate with"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.285795+00:00",
    "data": {
      "text": " Custom"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.406191+00:00",
    "data": {
      "text": " Tools"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.406780+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.407253+00:00",
    "data": {
      "text": " Minimal"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.407771+00:00",
    "data": {
      "text": " Example"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.408868+00:00",
    "data": {
      "text": "**\n\nThis"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.424671+00:00",
    "data": {
      "text": " shows"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.508900+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.509703+00:00",
    "data": {
      "text": " coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.510646+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.516923+00:00",
    "data": {
      "text": " with a"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.611402+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.611848+00:00",
    "data": {
      "text": "lookup"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.613059+00:00",
    "data": {
      "text": " tool"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.614215+00:00",
    "data": {
      "text": "** deleg"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.622209+00:00",
    "data": {
      "text": "ating to a"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.713813+00:00",
    "data": {
      "text": " specialist agent with"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.714332+00:00",
    "data": {
      "text": " a **format"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.715627+00:00",
    "data": {
      "text": " tool**"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.720156+00:00",
    "data": {
      "text": ". The w"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.731506+00:00",
    "data": {
      "text": "iring is automatic"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.816301+00:00",
    "data": {
      "text": " from"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.816826+00:00",
    "data": {
      "text": " YAML."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.819606+00:00",
    "data": {
      "text": "\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.918542+00:00",
    "data": {
      "text": "config"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.919054+00:00",
    "data": {
      "text": ".yaml:**\n```yaml\nmodels"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.920756+00:00",
    "data": {
      "text": ":\n  default"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.922386+00:00",
    "data": {
      "text": ":\n    provider"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:03.928615+00:00",
    "data": {
      "text": ": be"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.020526+00:00",
    "data": {
      "text": "drock\n    model"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.021350+00:00",
    "data": {
      "text": "_"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.022461+00:00",
    "data": {
      "text": "i"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.023259+00:00",
    "data": {
      "text": "d: open"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.038378+00:00",
    "data": {
      "text": "ai."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.123058+00:00",
    "data": {
      "text": "g"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.123518+00:00",
    "data": {
      "text": "pt-"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.124823+00:00",
    "data": {
      "text": "oss"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.225549+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.226043+00:00",
    "data": {
      "text": "20"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.227022+00:00",
    "data": {
      "text": "b"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.228528+00:00",
    "data": {
      "text": "-1"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.230931+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.327553+00:00",
    "data": {
      "text": "0"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.328979+00:00",
    "data": {
      "text": "\n\nagents:\n  specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.432212+00:00",
    "data": {
      "text": ":\n    model"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.432827+00:00",
    "data": {
      "text": ": default\n    tools:\n      "
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.433023+00:00",
    "data": {
      "text": "- ./"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.434700+00:00",
    "data": {
      "text": "tools."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.435841+00:00",
    "data": {
      "text": "py:"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.437800+00:00",
    "data": {
      "text": "format"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.438171+00:00",
    "data": {
      "text": "_result"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.532336+00:00",
    "data": {
      "text": "\n    "
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.533403+00:00",
    "data": {
      "text": "system"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.535263+00:00",
    "data": {
      "text": "_"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.536590+00:00",
    "data": {
      "text": "prompt: |\n      You format"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.542078+00:00",
    "data": {
      "text": " data"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.634521+00:00",
    "data": {
      "text": " into"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.635770+00:00",
    "data": {
      "text": " clean"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.640283+00:00",
    "data": {
      "text": " output"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.642131+00:00",
    "data": {
      "text": ".\n      Use"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.737161+00:00",
    "data": {
      "text": " your"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.737866+00:00",
    "data": {
      "text": " format"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.738799+00:00",
    "data": {
      "text": "_"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.839487+00:00",
    "data": {
      "text": "result tool to structure"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.839958+00:00",
    "data": {
      "text": " the response"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.842637+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.843025+00:00",
    "data": {
      "text": "\n\n  coordinator:\n    model: default"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.941611+00:00",
    "data": {
      "text": "\n    tools:\n      - ./"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.942559+00:00",
    "data": {
      "text": "tools.py:lookup_"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.945116+00:00",
    "data": {
      "text": "data"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.945528+00:00",
    "data": {
      "text": "\n    "
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.945617+00:00",
    "data": {
      "text": "system_prompt: |\n      You"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.947211+00:00",
    "data": {
      "text": " coordinate"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:04.948601+00:00",
    "data": {
      "text": " data"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.043880+00:00",
    "data": {
      "text": " retri"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.044811+00:00",
    "data": {
      "text": "eval an"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.045770+00:00",
    "data": {
      "text": "d formatting.\n      1"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.046653+00:00",
    "data": {
      "text": ". Call"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.146435+00:00",
    "data": {
      "text": " lookup"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.146884+00:00",
    "data": {
      "text": "_data to fetch"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.148048+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.149468+00:00",
    "data": {
      "text": " information"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.154162+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.248464+00:00",
    "data": {
      "text": "\n      2. Pass"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.250691+00:00",
    "data": {
      "text": " the result"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.251069+00:00",
    "data": {
      "text": " to specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.251740+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.261671+00:00",
    "data": {
      "text": " format it"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.284627+00:00",
    "data": {
      "text": ".\n      3. Return"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.306841+00:00",
    "data": {
      "text": " the formatted output"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.327759+00:00",
    "data": {
      "text": ".\n\norchest"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.350693+00:00",
    "data": {
      "text": "rations"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.374305+00:00",
    "data": {
      "text": ":\n  main"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.393480+00:00",
    "data": {
      "text": ":\n    mode"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.825077+00:00",
    "data": {
      "text": ": delegate\n    entry"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.826147+00:00",
    "data": {
      "text": "_name"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.827457+00:00",
    "data": {
      "text": ": coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.828876+00:00",
    "data": {
      "text": "\n    connections"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.829758+00:00",
    "data": {
      "text": ":\n      - agent"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.830640+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.854074+00:00",
    "data": {
      "text": " specialist\n        description"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.854170+00:00",
    "data": {
      "text": ": \"Format"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.858264+00:00",
    "data": {
      "text": " raw"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.858690+00:00",
    "data": {
      "text": " data into clean structure"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.858775+00:00",
    "data": {
      "text": "d output.\""
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.858843+00:00",
    "data": {
      "text": "\n\nentry"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.858911+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.858977+00:00",
    "data": {
      "text": " main\n```\n\n**tools.py"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.859070+00:00",
    "data": {
      "text": ":**\n```python\nfrom"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.861559+00:00",
    "data": {
      "text": " strands.tools.decorator import tool"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.861655+00:00",
    "data": {
      "text": "\n\n@tool\ndef lookup"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.862623+00:00",
    "data": {
      "text": "_data(query"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.881074+00:00",
    "data": {
      "text": ": str) -> str"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.881489+00:00",
    "data": {
      "text": ":\n    \"\"\"Fetch data for"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.883159+00:00",
    "data": {
      "text": " a query"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.898659+00:00",
    "data": {
      "text": ".\"\"\""
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.919316+00:00",
    "data": {
      "text": "\n    return"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.941122+00:00",
    "data": {
      "text": " f\"Raw"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.964454+00:00",
    "data": {
      "text": " data for '{"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:05.984918+00:00",
    "data": {
      "text": "query}':"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.006767+00:00",
    "data": {
      "text": " ["
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.028805+00:00",
    "data": {
      "text": "ID"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.050570+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.072460+00:00",
    "data": {
      "text": "42"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.095897+00:00",
    "data": {
      "text": ", Status"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.116769+00:00",
    "data": {
      "text": ":Active"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.138295+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.160293+00:00",
    "data": {
      "text": " Score"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.182169+00:00",
    "data": {
      "text": ":95]\"\n\n@tool"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.204107+00:00",
    "data": {
      "text": "\ndef format_result(data: str"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.292669+00:00",
    "data": {
      "text": ") -> str:\n    \"\"\"Format"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.296647+00:00",
    "data": {
      "text": " raw"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.444488+00:00",
    "data": {
      "text": " data into clean output"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.445227+00:00",
    "data": {
      "text": ".\"\"\"\n    return f\""
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.445661+00:00",
    "data": {
      "text": "✓"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.446698+00:00",
    "data": {
      "text": " Formatted: {data."
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.448212+00:00",
    "data": {
      "text": "upper"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.449564+00:00",
    "data": {
      "text": "()}\"\n```\n\n**What"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.451150+00:00",
    "data": {
      "text": " makes"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.452001+00:00",
    "data": {
      "text": " this note"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.462637+00:00",
    "data": {
      "text": "worthy:**"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.487268+00:00",
    "data": {
      "text": " The"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.512202+00:00",
    "data": {
      "text": " coordinator has"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.533247+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.555669+00:00",
    "data": {
      "text": "lookup_data` as"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.585696+00:00",
    "data": {
      "text": " a tool,"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.639067+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.640348+00:00",
    "data": {
      "text": " specialist has `format_result`,"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.652733+00:00",
    "data": {
      "text": " and the"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.673197+00:00",
    "data": {
      "text": " delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.699025+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.717282+00:00",
    "data": {
      "text": "ration"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.739293+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.761552+00:00",
    "data": {
      "text": "ires them together automatically"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.783214+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.805418+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.827133+00:00",
    "data": {
      "text": " coordinator calls the specialist as"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.858118+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.880097+00:00",
    "data": {
      "text": " tool"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.901600+00:00",
    "data": {
      "text": " without"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.923005+00:00",
    "data": {
      "text": " writing"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.955452+00:00",
    "data": {
      "text": " any"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:06.974451+00:00",
    "data": {
      "text": " Python"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:07.015196+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:07.017879+00:00",
    "data": {
      "text": "ration logic"
    }
  },
  {
    "type": "token",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:07.040113+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "agent_complete",
    "agent_name": "developer",
    "timestamp": "2026-07-12T00:48:07.148415+00:00",
    "data": {
      "usage": {
        "input_tokens": 21939,
        "output_tokens": 820,
        "total_tokens": 22759
      },
      "text": "Perfect! Now I have everything I need. Let me create a SHORT, ESSENTIAL example that combines:\n- A delegate orchestration with two agents (coordinator and specialist)\n- The coordinator has one custom tool\n- The specialist has another custom tool\n- Minimal, fast to read\n\nHere's the example:\n\n---\n\n## **Delegate with Custom Tools — Minimal Example**\n\nThis shows a coordinator agent with a **lookup tool** delegating to a specialist agent with a **format tool**. The wiring is automatic from YAML.\n\n**config.yaml:**\n```yaml\nmodels:\n  default:\n    provider: bedrock\n    model_id: openai.gpt-oss-20b-1:0\n\nagents:\n  specialist:\n    model: default\n    tools:\n      - ./tools.py:format_result\n    system_prompt: |\n      You format data into clean output.\n      Use your format_result tool to structure the response.\n\n  coordinator:\n    model: default\n    tools:\n      - ./tools.py:lookup_data\n    system_prompt: |\n      You coordinate data retrieval and formatting.\n      1. Call lookup_data to fetch the information.\n      2. Pass the result to specialist to format it.\n      3. Return the formatted output.\n\norchestrations:\n  main:\n    mode: delegate\n    entry_name: coordinator\n    connections:\n      - agent: specialist\n        description: \"Format raw data into clean structured output.\"\n\nentry: main\n```\n\n**tools.py:**\n```python\nfrom strands.tools.decorator import tool\n\n@tool\ndef lookup_data(query: str) -> str:\n    \"\"\"Fetch data for a query.\"\"\"\n    return f\"Raw data for '{query}': [ID:42, Status:Active, Score:95]\"\n\n@tool\ndef format_result(data: str) -> str:\n    \"\"\"Format raw data into clean output.\"\"\"\n    return f\"✓ Formatted: {data.upper()}\"\n```\n\n**What makes this noteworthy:** The coordinator has `lookup_data` as a tool, the specialist has `format_result`, and the delegate orchestration wires them together automatically — the coordinator calls the specialist as a tool without writing any Python orchestration logic.\n",
      "message": {
        "role": "assistant",
        "content": [
          {
            "text": "Perfect! Now I have everything I need. Let me create a SHORT, ESSENTIAL example that combines:\n- A delegate orchestration with two agents (coordinator and specialist)\n- The coordinator has one custom tool\n- The specialist has another custom tool\n- Minimal, fast to read\n\nHere's the example:\n\n---\n\n## **Delegate with Custom Tools — Minimal Example**\n\nThis shows a coordinator agent with a **lookup tool** delegating to a specialist agent with a **format tool**. The wiring is automatic from YAML.\n\n**config.yaml:**\n```yaml\nmodels:\n  default:\n    provider: bedrock\n    model_id: openai.gpt-oss-20b-1:0\n\nagents:\n  specialist:\n    model: default\n    tools:\n      - ./tools.py:format_result\n    system_prompt: |\n      You format data into clean output.\n      Use your format_result tool to structure the response.\n\n  coordinator:\n    model: default\n    tools:\n      - ./tools.py:lookup_data\n    system_prompt: |\n      You coordinate data retrieval and formatting.\n      1. Call lookup_data to fetch the information.\n      2. Pass the result to specialist to format it.\n      3. Return the formatted output.\n\norchestrations:\n  main:\n    mode: delegate\n    entry_name: coordinator\n    connections:\n      - agent: specialist\n        description: \"Format raw data into clean structured output.\"\n\nentry: main\n```\n\n**tools.py:**\n```python\nfrom strands.tools.decorator import tool\n\n@tool\ndef lookup_data(query: str) -> str:\n    \"\"\"Fetch data for a query.\"\"\"\n    return f\"Raw data for '{query}': [ID:42, Status:Active, Score:95]\"\n\n@tool\ndef format_result(data: str) -> str:\n    \"\"\"Format raw data into clean output.\"\"\"\n    return f\"✓ Formatted: {data.upper()}\"\n```\n\n**What makes this noteworthy:** The coordinator has `lookup_data` as a tool, the specialist has `format_result`, and the delegate orchestration wires them together automatically — the coordinator calls the specialist as a tool without writing any Python orchestration logic."
          }
        ],
        "metadata": {
          "usage": {
            "inputTokens": 7493,
            "outputTokens": 512,
            "totalTokens": 8005
          },
          "metrics": {
            "latencyMs": 5805,
            "timeToFirstByteMs": 995
          }
        },
        "tracking_id": "4723584a-2eaf-4f4a-9b97-8d7a7f873e1a"
      }
    }
  },
  {
    "type": "tool_end",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:07.148616+00:00",
    "data": {
      "tool_name": "developer",
      "tool_label": "Delegating work to agent: Developer",
      "tool_use_id": "tooluse_sI9ztG47yamlqCa2QVusZb",
      "status": "success",
      "error": null,
      "tool_result": "Perfect! Now I have everything I need. Let me create a SHORT, ESSENTIAL example that combines:\n- A delegate orchestration with two agents (coordinator and specialist)\n- The coordinator has one custom tool\n- The specialist has another custom tool\n- Minimal, fast to read\n\nHere's the example:\n\n---\n\n## **Delegate with Custom Tools — Minimal Example**\n\nThis shows a coordinator agent with a **lookup tool** delegating to a specialist agent with a **format tool**. The wiring is automatic from YAML.\n\n**config.yaml:**\n```yaml\nmodels:\n  default:\n    provider: bedrock\n    model_id: openai.gpt-oss-20b-1:0\n..."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:07.995836+00:00",
    "data": {
      "text": "Perfect"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.029476+00:00",
    "data": {
      "text": "! Now"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.029886+00:00",
    "data": {
      "text": " I have all"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.050243+00:00",
    "data": {
      "text": " the pieces"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.071580+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.093356+00:00",
    "data": {
      "text": " Let me synthes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.115409+00:00",
    "data": {
      "text": "ize this into a comprehensive,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.140773+00:00",
    "data": {
      "text": " well-structured answer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.160082+00:00",
    "data": {
      "text": " for"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.179386+00:00",
    "data": {
      "text": " the user.\n\n---"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.202239+00:00",
    "data": {
      "text": "\n\n## I"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.222289+00:00",
    "data": {
      "text": " am"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.244052+00:00",
    "data": {
      "text": " demo"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.266275+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.297400+00:00",
    "data": {
      "text": " of"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.318268+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.339836+00:00",
    "data": {
      "text": "ands-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.361845+00:00",
    "data": {
      "text": "compose"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.383560+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.432979+00:00",
    "data": {
      "text": " I cannot"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.433042+00:00",
    "data": {
      "text": " answer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.448055+00:00",
    "data": {
      "text": " your"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.481864+00:00",
    "data": {
      "text": " specific"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.491044+00:00",
    "data": {
      "text": " questions"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.513668+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.534484+00:00",
    "data": {
      "text": " "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.580308+00:00",
    "data": {
      "text": "\nhowever"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.581508+00:00",
    "data": {
      "text": " let"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.600448+00:00",
    "data": {
      "text": " me present"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.622192+00:00",
    "data": {
      "text": " what"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.644515+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.666299+00:00",
    "data": {
      "text": "ands-compose is,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.687539+00:00",
    "data": {
      "text": " what"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.712748+00:00",
    "data": {
      "text": " does"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.731527+00:00",
    "data": {
      "text": " it bring"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.752559+00:00",
    "data": {
      "text": " to the table "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.774939+00:00",
    "data": {
      "text": "\nand how you"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.795943+00:00",
    "data": {
      "text": " can use it"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.817971+00:00",
    "data": {
      "text": "\n\n---"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.839332+00:00",
    "data": {
      "text": "\n\n## What str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.867028+00:00",
    "data": {
      "text": "ands-compose Is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.891346+00:00",
    "data": {
      "text": "\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.913066+00:00",
    "data": {
      "text": "str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.934850+00:00",
    "data": {
      "text": "ands-compose is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.957896+00:00",
    "data": {
      "text": " a declar"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.978213+00:00",
    "data": {
      "text": "ative configuration"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:08.999385+00:00",
    "data": {
      "text": " layer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.021250+00:00",
    "data": {
      "text": " for building"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.043203+00:00",
    "data": {
      "text": " multi"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.064858+00:00",
    "data": {
      "text": "-agent systems"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.086144+00:00",
    "data": {
      "text": ".** Think"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.107940+00:00",
    "data": {
      "text": " of it like"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.129794+00:00",
    "data": {
      "text": " Docker"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.156086+00:00",
    "data": {
      "text": " Compose,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.175353+00:00",
    "data": {
      "text": " but for AI agents."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.201157+00:00",
    "data": {
      "text": " You"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.219250+00:00",
    "data": {
      "text": " describe"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.240571+00:00",
    "data": {
      "text": " your"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.262615+00:00",
    "data": {
      "text": " entire agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.284303+00:00",
    "data": {
      "text": " network"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.305968+00:00",
    "data": {
      "text": " in a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.328494+00:00",
    "data": {
      "text": " YAML file —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.364732+00:00",
    "data": {
      "text": " including"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.371763+00:00",
    "data": {
      "text": " models"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.393910+00:00",
    "data": {
      "text": ", tools, hooks"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.414777+00:00",
    "data": {
      "text": ", M"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.436646+00:00",
    "data": {
      "text": "CP"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.458089+00:00",
    "data": {
      "text": " servers"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.479869+00:00",
    "data": {
      "text": ", and how"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.501001+00:00",
    "data": {
      "text": " agents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.523034+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.545881+00:00",
    "data": {
      "text": "rate together"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.575270+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.596771+00:00",
    "data": {
      "text": " and strands-compose resol"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.619363+00:00",
    "data": {
      "text": "ves,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.640413+00:00",
    "data": {
      "text": " validates"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.661770+00:00",
    "data": {
      "text": ", and w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.684508+00:00",
    "data": {
      "text": "ires everything into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.705290+00:00",
    "data": {
      "text": " a working"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.727501+00:00",
    "data": {
      "text": " system.\n\nThe"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.750736+00:00",
    "data": {
      "text": " core"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.800820+00:00",
    "data": {
      "text": " insight"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.833708+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.855016+00:00",
    "data": {
      "text": " this"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.876852+00:00",
    "data": {
      "text": ": **str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.899239+00:00",
    "data": {
      "text": "ands-compose is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.920100+00:00",
    "data": {
      "text": " not"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.941569+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.982132+00:00",
    "data": {
      "text": " framework that"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:09.984634+00:00",
    "data": {
      "text": " sits"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.006546+00:00",
    "data": {
      "text": " between you"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.028555+00:00",
    "data": {
      "text": " and str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.050129+00:00",
    "data": {
      "text": "ands at"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.071724+00:00",
    "data": {
      "text": " runtime."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.093666+00:00",
    "data": {
      "text": "** Instead, it is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.115704+00:00",
    "data": {
      "text": " a *"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.139930+00:00",
    "data": {
      "text": "composition"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.163163+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.185095+00:00",
    "data": {
      "text": "d w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.206464+00:00",
    "data": {
      "text": "iring layer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.228682+00:00",
    "data": {
      "text": "*"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.250431+00:00",
    "data": {
      "text": ". After"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.271883+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.293744+00:00",
    "data": {
      "text": "loa"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.315732+00:00",
    "data": {
      "text": "d()"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.337364+00:00",
    "data": {
      "text": "`,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.362100+00:00",
    "data": {
      "text": " what"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.381067+00:00",
    "data": {
      "text": " you get back"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.402775+00:00",
    "data": {
      "text": " are"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.432716+00:00",
    "data": {
      "text": " plain"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.454542+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.476438+00:00",
    "data": {
      "text": " native"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.502948+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.531524+00:00",
    "data": {
      "text": "ands objects"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.553718+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.575162+00:00",
    "data": {
      "text": " real"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.597086+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.620491+00:00",
    "data": {
      "text": "str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.661319+00:00",
    "data": {
      "text": "ands."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.666060+00:00",
    "data": {
      "text": "Agent`"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.688896+00:00",
    "data": {
      "text": " instances,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.710658+00:00",
    "data": {
      "text": " real"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.732531+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.774337+00:00",
    "data": {
      "text": "rators"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.775770+00:00",
    "data": {
      "text": " like"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.801701+00:00",
    "data": {
      "text": " `strands.multi"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.819741+00:00",
    "data": {
      "text": "ag"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.842868+00:00",
    "data": {
      "text": "ent.Sw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.863219+00:00",
    "data": {
      "text": "arm`"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.885299+00:00",
    "data": {
      "text": " or `Graph"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.907285+00:00",
    "data": {
      "text": "`, real"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.928535+00:00",
    "data": {
      "text": " MCP clients"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.950237+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:10.973483+00:00",
    "data": {
      "text": " Once"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.010840+00:00",
    "data": {
      "text": " built"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.033271+00:00",
    "data": {
      "text": ", str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.053517+00:00",
    "data": {
      "text": "ands-compose steps"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.074960+00:00",
    "data": {
      "text": " out"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.101713+00:00",
    "data": {
      "text": " of"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.122861+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.179288+00:00",
    "data": {
      "text": " way"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.180424+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.189204+00:00",
    "data": {
      "text": " You interact"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.220823+00:00",
    "data": {
      "text": " with standar"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.241968+00:00",
    "data": {
      "text": "d strands APIs"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.263663+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.285943+00:00",
    "data": {
      "text": " exactly"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.307795+00:00",
    "data": {
      "text": " as documente"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.329547+00:00",
    "data": {
      "text": "d.\n\n###"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.351171+00:00",
    "data": {
      "text": " The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.373557+00:00",
    "data": {
      "text": " Two"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.417942+00:00",
    "data": {
      "text": " Packages"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.424953+00:00",
    "data": {
      "text": "\n\nstr"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.446905+00:00",
    "data": {
      "text": "ands-compose ships"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.468801+00:00",
    "data": {
      "text": " as"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.492167+00:00",
    "data": {
      "text": " **"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.534380+00:00",
    "data": {
      "text": "two separate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.552478+00:00",
    "data": {
      "text": " packages**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.573848+00:00",
    "data": {
      "text": ":\n\n|"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.596496+00:00",
    "data": {
      "text": " Package | GitHub"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.618412+00:00",
    "data": {
      "text": " | Purpose"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.639566+00:00",
    "data": {
      "text": " |"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.661632+00:00",
    "data": {
      "text": " Require"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.682735+00:00",
    "data": {
      "text": "d?"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.704726+00:00",
    "data": {
      "text": " |\n|---------|--------|------"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.731366+00:00",
    "data": {
      "text": "---|-----------|\n| **"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.748177+00:00",
    "data": {
      "text": "strands-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.769610+00:00",
    "data": {
      "text": "compose** ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.791544+00:00",
    "data": {
      "text": "sdk"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.815207+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.834693+00:00",
    "data": {
      "text": "python"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.857361+00:00",
    "data": {
      "text": ") | https://github.com/"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.887400+00:00",
    "data": {
      "text": "strands-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.916924+00:00",
    "data": {
      "text": "compose"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.938310+00:00",
    "data": {
      "text": "/sdk"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:11.962857+00:00",
    "data": {
      "text": "-python | Core library:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.004062+00:00",
    "data": {
      "text": " YAML parsing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.025758+00:00",
    "data": {
      "text": ", validation, agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.047845+00:00",
    "data": {
      "text": "/"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.069145+00:00",
    "data": {
      "text": "orchestration"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.092201+00:00",
    "data": {
      "text": " building"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.114611+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.141964+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.157866+00:00",
    "data": {
      "text": "iring,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.179739+00:00",
    "data": {
      "text": " streaming"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.201349+00:00",
    "data": {
      "text": " | **"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.223014+00:00",
    "data": {
      "text": "Yes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.244844+00:00",
    "data": {
      "text": "** —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.271868+00:00",
    "data": {
      "text": " this"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.288613+00:00",
    "data": {
      "text": " is what you buil"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.309778+00:00",
    "data": {
      "text": "d with"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.332357+00:00",
    "data": {
      "text": " |\n| **strands-compose"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.352890+00:00",
    "data": {
      "text": "-ag"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.375803+00:00",
    "data": {
      "text": "entcore"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.396608+00:00",
    "data": {
      "text": "** ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.418420+00:00",
    "data": {
      "text": "be"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.439925+00:00",
    "data": {
      "text": "drock-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.461725+00:00",
    "data": {
      "text": "ag"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.484098+00:00",
    "data": {
      "text": "entcore) | https://github."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.510318+00:00",
    "data": {
      "text": "com/strands-compose/be"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.532854+00:00",
    "data": {
      "text": "drock-agentcore | Optional"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.554887+00:00",
    "data": {
      "text": " adapter"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.576314+00:00",
    "data": {
      "text": " for"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.598088+00:00",
    "data": {
      "text": " deplo"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.620081+00:00",
    "data": {
      "text": "ying to"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.641378+00:00",
    "data": {
      "text": " AWS"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.684700+00:00",
    "data": {
      "text": " Bedrock Ag"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.706761+00:00",
    "data": {
      "text": "entCore | **No** — only"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.730963+00:00",
    "data": {
      "text": " if"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.749796+00:00",
    "data": {
      "text": " you want manage"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.772407+00:00",
    "data": {
      "text": "d clou"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.801625+00:00",
    "data": {
      "text": "d deployment |\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.823358+00:00",
    "data": {
      "text": "The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.845443+00:00",
    "data": {
      "text": " key point"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.867046+00:00",
    "data": {
      "text": ":** You"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.888729+00:00",
    "data": {
      "text": " can"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.912569+00:00",
    "data": {
      "text": " use str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.934432+00:00",
    "data": {
      "text": "ands-compose entirely"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.958510+00:00",
    "data": {
      "text": " standalone on"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:12.988583+00:00",
    "data": {
      "text": " your"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.023482+00:00",
    "data": {
      "text": " laptop"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.031243+00:00",
    "data": {
      "text": " or"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.052554+00:00",
    "data": {
      "text": " in your own"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.074576+00:00",
    "data": {
      "text": " infrastructure"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.095749+00:00",
    "data": {
      "text": ". The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.118697+00:00",
    "data": {
      "text": " be"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.139440+00:00",
    "data": {
      "text": "drock-agentcore adapter"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.161236+00:00",
    "data": {
      "text": " is purely"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.185233+00:00",
    "data": {
      "text": " optional and only comes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.204555+00:00",
    "data": {
      "text": " into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.226896+00:00",
    "data": {
      "text": " play if you decide"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.256852+00:00",
    "data": {
      "text": " to deploy to AWS Bedrock Ag"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.280254+00:00",
    "data": {
      "text": "entCore for"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.300081+00:00",
    "data": {
      "text": " managed hosting"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.322059+00:00",
    "data": {
      "text": ".\n\n---"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.344357+00:00",
    "data": {
      "text": "\n\n## Why"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.365594+00:00",
    "data": {
      "text": " It"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.387082+00:00",
    "data": {
      "text": " Matters —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.430611+00:00",
    "data": {
      "text": " Unique"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.451802+00:00",
    "data": {
      "text": " Benefits"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.474057+00:00",
    "data": {
      "text": "\n\n|"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.517640+00:00",
    "data": {
      "text": " Benefit | What"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.538575+00:00",
    "data": {
      "text": " It Means"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.560951+00:00",
    "data": {
      "text": " |"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.582785+00:00",
    "data": {
      "text": " Why"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.604602+00:00",
    "data": {
      "text": " It Matters |\n|---------|"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.625366+00:00",
    "data": {
      "text": "------------"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.647053+00:00",
    "data": {
      "text": "---|-------------"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.669350+00:00",
    "data": {
      "text": "---|\n| **No"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.690735+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.712578+00:00",
    "data": {
      "text": "rap"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.734854+00:00",
    "data": {
      "text": "pers —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.755975+00:00",
    "data": {
      "text": " native"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.779669+00:00",
    "data": {
      "text": " strands objects"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.799386+00:00",
    "data": {
      "text": "** | After"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.821178+00:00",
    "data": {
      "text": " `load()`, you hol"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.842561+00:00",
    "data": {
      "text": "d real"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.864316+00:00",
    "data": {
      "text": " `strands.Agent`,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.886331+00:00",
    "data": {
      "text": " real"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.911518+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.931849+00:00",
    "data": {
      "text": "Swarm`, real `Graph`"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.961308+00:00",
    "data": {
      "text": " instances."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:13.982927+00:00",
    "data": {
      "text": " No prox"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.004476+00:00",
    "data": {
      "text": "ies, no framework"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.030672+00:00",
    "data": {
      "text": " layer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.049586+00:00",
    "data": {
      "text": " at"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.069252+00:00",
    "data": {
      "text": " runtime"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.091439+00:00",
    "data": {
      "text": ". | If"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.113323+00:00",
    "data": {
      "text": " you know"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.134597+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.156666+00:00",
    "data": {
      "text": "ands, you already"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.180928+00:00",
    "data": {
      "text": " know str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.203655+00:00",
    "data": {
      "text": "ands-compose. Full"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.225130+00:00",
    "data": {
      "text": " access"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.254708+00:00",
    "data": {
      "text": " to the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.276201+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.297837+00:00",
    "data": {
      "text": "ands API. No"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.320469+00:00",
    "data": {
      "text": " lock"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.371870+00:00",
    "data": {
      "text": "-in. |\n| **Configuration"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.408569+00:00",
    "data": {
      "text": " as"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.440259+00:00",
    "data": {
      "text": " data"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.453910+00:00",
    "data": {
      "text": "** | Your"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.474449+00:00",
    "data": {
      "text": " entire agent network lives"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.495913+00:00",
    "data": {
      "text": " in YAML ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.525867+00:00",
    "data": {
      "text": "plus"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.550402+00:00",
    "data": {
      "text": " small"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.568965+00:00",
    "data": {
      "text": " Python"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.590322+00:00",
    "data": {
      "text": " files"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.612182+00:00",
    "data": {
      "text": " for"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.655446+00:00",
    "data": {
      "text": " custom"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.676037+00:00",
    "data": {
      "text": " tools)."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.685479+00:00",
    "data": {
      "text": " Commit"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.708162+00:00",
    "data": {
      "text": " to Git"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.728970+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.750936+00:00",
    "data": {
      "text": " diff"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.772396+00:00",
    "data": {
      "text": " versions"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.794341+00:00",
    "data": {
      "text": ", see"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.816238+00:00",
    "data": {
      "text": " exactly what change"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.837640+00:00",
    "data": {
      "text": "d. | Reproduc"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.859142+00:00",
    "data": {
      "text": "ibility"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.881754+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.902669+00:00",
    "data": {
      "text": " vers"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.924172+00:00",
    "data": {
      "text": "ioning, automate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.945951+00:00",
    "data": {
      "text": "d experiments"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.970352+00:00",
    "data": {
      "text": ". A"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:14.992983+00:00",
    "data": {
      "text": " bug"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.014076+00:00",
    "data": {
      "text": " report"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.054796+00:00",
    "data": {
      "text": " comes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.057182+00:00",
    "data": {
      "text": " with"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.079692+00:00",
    "data": {
      "text": " its"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.100818+00:00",
    "data": {
      "text": " exact"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.142783+00:00",
    "data": {
      "text": " config"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.143682+00:00",
    "data": {
      "text": ";"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.165530+00:00",
    "data": {
      "text": " loa"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.187723+00:00",
    "data": {
      "text": "d it,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.209112+00:00",
    "data": {
      "text": " replay"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.230827+00:00",
    "data": {
      "text": " it, debug"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.252831+00:00",
    "data": {
      "text": " it. |\n| **Unifie"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.275243+00:00",
    "data": {
      "text": "d streaming"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.296984+00:00",
    "data": {
      "text": " across"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.326867+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.347934+00:00",
    "data": {
      "text": " entire"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.370215+00:00",
    "data": {
      "text": " system** | One"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.393559+00:00",
    "data": {
      "text": " call"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.422358+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.437638+00:00",
    "data": {
      "text": "ires an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.459141+00:00",
    "data": {
      "text": " event"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.481353+00:00",
    "data": {
      "text": " publisher"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.523355+00:00",
    "data": {
      "text": " into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.524489+00:00",
    "data": {
      "text": " every"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.567732+00:00",
    "data": {
      "text": " agent an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.568610+00:00",
    "data": {
      "text": "d orchestrator at"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.589418+00:00",
    "data": {
      "text": " any"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.611341+00:00",
    "data": {
      "text": " depth"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.632857+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.658338+00:00",
    "data": {
      "text": " f"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.689330+00:00",
    "data": {
      "text": "unn"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.706176+00:00",
    "data": {
      "text": "eling everything"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.728720+00:00",
    "data": {
      "text": " into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.750037+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.771640+00:00",
    "data": {
      "text": " uniform"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.794260+00:00",
    "data": {
      "text": " stream. | No"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.815539+00:00",
    "data": {
      "text": " topology"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.837128+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.858790+00:00",
    "data": {
      "text": "specific"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.880720+00:00",
    "data": {
      "text": " code. Whether"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.902367+00:00",
    "data": {
      "text": " you have"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.923927+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.947122+00:00",
    "data": {
      "text": " agent or a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.969583+00:00",
    "data": {
      "text": " delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:15.991341+00:00",
    "data": {
      "text": " containing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.014064+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.044671+00:00",
    "data": {
      "text": " sw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.088104+00:00",
    "data": {
      "text": "arm containing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.090338+00:00",
    "data": {
      "text": " a graph three"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.109714+00:00",
    "data": {
      "text": " levels deep, you"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.131569+00:00",
    "data": {
      "text": " get one"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.153224+00:00",
    "data": {
      "text": " stream with"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.176608+00:00",
    "data": {
      "text": " consistent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.196884+00:00",
    "data": {
      "text": " event"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.224177+00:00",
    "data": {
      "text": " shapes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.240426+00:00",
    "data": {
      "text": ". |\n| **Compos"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.262323+00:00",
    "data": {
      "text": "able orchestrations"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.284451+00:00",
    "data": {
      "text": "** | You"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.314068+00:00",
    "data": {
      "text": " can nest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.335550+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.356528+00:00",
    "data": {
      "text": " three"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.378791+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.400385+00:00",
    "data": {
      "text": "ration"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.423287+00:00",
    "data": {
      "text": " styles"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.443984+00:00",
    "data": {
      "text": " arbit"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.465665+00:00",
    "data": {
      "text": "rarily:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.487204+00:00",
    "data": {
      "text": " delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.509113+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.530552+00:00",
    "data": {
      "text": "hub"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.552688+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.574257+00:00",
    "data": {
      "text": "and-spoke), swarm (peer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.595738+00:00",
    "data": {
      "text": " collaboration"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.630350+00:00",
    "data": {
      "text": "), an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.639190+00:00",
    "data": {
      "text": "d graph (determin"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.661581+00:00",
    "data": {
      "text": "istic pipeline"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.682949+00:00",
    "data": {
      "text": "). | Build complex,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.704402+00:00",
    "data": {
      "text": " hierarch"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.727186+00:00",
    "data": {
      "text": "ical agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.749389+00:00",
    "data": {
      "text": " systems"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.772035+00:00",
    "data": {
      "text": " without"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.792482+00:00",
    "data": {
      "text": " han"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.814020+00:00",
    "data": {
      "text": "d-writing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.835944+00:00",
    "data": {
      "text": " pl"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.857713+00:00",
    "data": {
      "text": "umbing code. A"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.879789+00:00",
    "data": {
      "text": " sw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.900969+00:00",
    "data": {
      "text": "arm can be"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.925492+00:00",
    "data": {
      "text": " a tool"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.944377+00:00",
    "data": {
      "text": " inside"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.965983+00:00",
    "data": {
      "text": " a delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:16.987652+00:00",
    "data": {
      "text": ";"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.010413+00:00",
    "data": {
      "text": " a delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.031139+00:00",
    "data": {
      "text": " can be a node"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.052899+00:00",
    "data": {
      "text": " in a graph"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.078205+00:00",
    "data": {
      "text": ". |\n| **Review"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.096734+00:00",
    "data": {
      "text": "able,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.126444+00:00",
    "data": {
      "text": " v"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.147859+00:00",
    "data": {
      "text": "ersionable agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.169426+00:00",
    "data": {
      "text": " systems** | Your"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.191558+00:00",
    "data": {
      "text": " agent topology"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.214128+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.235430+00:00",
    "data": {
      "text": " tool"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.256847+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.281901+00:00",
    "data": {
      "text": "iring, hook"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.300261+00:00",
    "data": {
      "text": " order"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.322362+00:00",
    "data": {
      "text": ", and model"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.346262+00:00",
    "data": {
      "text": " choices"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.367496+00:00",
    "data": {
      "text": " are"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.388823+00:00",
    "data": {
      "text": " all visible"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.410693+00:00",
    "data": {
      "text": " in"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.432578+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.454553+00:00",
    "data": {
      "text": " place. | Teams"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.476022+00:00",
    "data": {
      "text": " can review"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.497698+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.519211+00:00",
    "data": {
      "text": " systems"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.540840+00:00",
    "data": {
      "text": " like"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.562623+00:00",
    "data": {
      "text": " code"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.611210+00:00",
    "data": {
      "text": ". Changes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.612125+00:00",
    "data": {
      "text": " are au"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.627336+00:00",
    "data": {
      "text": "ditable."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.649305+00:00",
    "data": {
      "text": " Reproduc"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.671527+00:00",
    "data": {
      "text": "ible across"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.696094+00:00",
    "data": {
      "text": " environments. |"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.720682+00:00",
    "data": {
      "text": "\n\n---\n\n## The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.746410+00:00",
    "data": {
      "text": " Three"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.767477+00:00",
    "data": {
      "text": " Orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.789814+00:00",
    "data": {
      "text": "ration Modes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.810739+00:00",
    "data": {
      "text": "\n\nstr"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.832722+00:00",
    "data": {
      "text": "ands-compose supports three ways"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.854125+00:00",
    "data": {
      "text": " to orchestrate multiple"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:17.875753+00:00",
    "data": {
      "text": " agents:\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.212794+00:00",
    "data": {
      "text": "1. Delegate (Hub-an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.214330+00:00",
    "data": {
      "text": "d-spoke"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.215336+00:00",
    "data": {
      "text": ")**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.217169+00:00",
    "data": {
      "text": "  "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.217218+00:00",
    "data": {
      "text": "\nOne"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.219381+00:00",
    "data": {
      "text": " coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.219748+00:00",
    "data": {
      "text": " agent treats"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.219837+00:00",
    "data": {
      "text": " other"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.221161+00:00",
    "data": {
      "text": " agents as tools"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.222905+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.224026+00:00",
    "data": {
      "text": " can call. The coordinator has"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.226306+00:00",
    "data": {
      "text": " explicit"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.226401+00:00",
    "data": {
      "text": " control"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.226473+00:00",
    "data": {
      "text": " over who"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.239299+00:00",
    "data": {
      "text": " does"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.242908+00:00",
    "data": {
      "text": " what an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.264745+00:00",
    "data": {
      "text": "d when."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.286301+00:00",
    "data": {
      "text": "  "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.307521+00:00",
    "data": {
      "text": "\n*"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.330070+00:00",
    "data": {
      "text": "When"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.351403+00:00",
    "data": {
      "text": " to use:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.373010+00:00",
    "data": {
      "text": "* You"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.394425+00:00",
    "data": {
      "text": " want a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.416915+00:00",
    "data": {
      "text": " \""
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.438355+00:00",
    "data": {
      "text": "boss"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.459820+00:00",
    "data": {
      "text": "\" making"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.481085+00:00",
    "data": {
      "text": " decisions about task"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.502611+00:00",
    "data": {
      "text": " flow"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.524845+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.546392+00:00",
    "data": {
      "text": " Example"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.568185+00:00",
    "data": {
      "text": ": a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.589617+00:00",
    "data": {
      "text": " manager"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.611620+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.653240+00:00",
    "data": {
      "text": " that decides"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.654740+00:00",
    "data": {
      "text": " whether"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.677342+00:00",
    "data": {
      "text": " to route"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.698070+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.719929+00:00",
    "data": {
      "text": " request"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.741916+00:00",
    "data": {
      "text": " to a sales"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.763660+00:00",
    "data": {
      "text": " agent,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.785341+00:00",
    "data": {
      "text": " support"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.806940+00:00",
    "data": {
      "text": " agent, or technical specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.831089+00:00",
    "data": {
      "text": ".\n\n**2. Swarm"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.878603+00:00",
    "data": {
      "text": " (Peer collaboration)**  "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.914527+00:00",
    "data": {
      "text": "\nAgents han"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.935662+00:00",
    "data": {
      "text": "d control"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.958261+00:00",
    "data": {
      "text": " off"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:18.979787+00:00",
    "data": {
      "text": " to each other autonom"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.000838+00:00",
    "data": {
      "text": "ously,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.022777+00:00",
    "data": {
      "text": " with no"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.044356+00:00",
    "data": {
      "text": " central coordinator."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.066277+00:00",
    "data": {
      "text": " They"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.088706+00:00",
    "data": {
      "text": " negotiate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.110744+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.132293+00:00",
    "data": {
      "text": "d collaborate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.154410+00:00",
    "data": {
      "text": " directly"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.176068+00:00",
    "data": {
      "text": ".  \n*When to use:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.196764+00:00",
    "data": {
      "text": "*"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.219584+00:00",
    "data": {
      "text": " Negoti"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.250529+00:00",
    "data": {
      "text": "ation-style"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.271076+00:00",
    "data": {
      "text": " loops"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.293031+00:00",
    "data": {
      "text": " like"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.314533+00:00",
    "data": {
      "text": " draft"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.337123+00:00",
    "data": {
      "text": " →"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.360894+00:00",
    "data": {
      "text": " review → rev"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.390850+00:00",
    "data": {
      "text": "ise."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.412448+00:00",
    "data": {
      "text": " Example"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.434330+00:00",
    "data": {
      "text": ": a writer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.455893+00:00",
    "data": {
      "text": " agent draf"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.477356+00:00",
    "data": {
      "text": "ts"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.498718+00:00",
    "data": {
      "text": " content"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.521140+00:00",
    "data": {
      "text": ", a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.542217+00:00",
    "data": {
      "text": " reviewer agent crit"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.565611+00:00",
    "data": {
      "text": "iques it"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.584737+00:00",
    "data": {
      "text": ", an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.619075+00:00",
    "data": {
      "text": "d they"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.628235+00:00",
    "data": {
      "text": " iterate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.650201+00:00",
    "data": {
      "text": " back"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.671800+00:00",
    "data": {
      "text": " and forth until"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.694293+00:00",
    "data": {
      "text": " satisfie"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.715520+00:00",
    "data": {
      "text": "d.\n\n**3. Graph ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.736921+00:00",
    "data": {
      "text": "Deterministic pipeline)**  \nAgents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.758461+00:00",
    "data": {
      "text": " run"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.783572+00:00",
    "data": {
      "text": " in a fixe"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.803084+00:00",
    "data": {
      "text": "d dependency"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.824084+00:00",
    "data": {
      "text": " order"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.846623+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.867360+00:00",
    "data": {
      "text": "a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.888681+00:00",
    "data": {
      "text": " DA"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.910597+00:00",
    "data": {
      "text": "G —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.932439+00:00",
    "data": {
      "text": " directed acyclic graph),"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.953945+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.975831+00:00",
    "data": {
      "text": "d independent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:19.997420+00:00",
    "data": {
      "text": " steps"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.023549+00:00",
    "data": {
      "text": " can"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.042254+00:00",
    "data": {
      "text": " run in parallel.  \n*When"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.062557+00:00",
    "data": {
      "text": " to use:* When"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.084202+00:00",
    "data": {
      "text": " you know"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.105659+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.127640+00:00",
    "data": {
      "text": " exact processing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.149543+00:00",
    "data": {
      "text": " order up"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.187084+00:00",
    "data": {
      "text": "front. Example: a data pipeline"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.192937+00:00",
    "data": {
      "text": " where"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.215797+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.237823+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.259513+00:00",
    "data": {
      "text": " extra"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.471305+00:00",
    "data": {
      "text": "cts data, another validates"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.471909+00:00",
    "data": {
      "text": " it, and a third transforms"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.473930+00:00",
    "data": {
      "text": " it.\n\n**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.474091+00:00",
    "data": {
      "text": "Cruc"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.474128+00:00",
    "data": {
      "text": "ially:** These"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.474159+00:00",
    "data": {
      "text": " are"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.474191+00:00",
    "data": {
      "text": " not separate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.474219+00:00",
    "data": {
      "text": " products"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.475043+00:00",
    "data": {
      "text": " — they are"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.485097+00:00",
    "data": {
      "text": " building"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.507014+00:00",
    "data": {
      "text": " blocks that"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.528865+00:00",
    "data": {
      "text": " click"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.550577+00:00",
    "data": {
      "text": " together."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.572589+00:00",
    "data": {
      "text": " You can nest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.613111+00:00",
    "data": {
      "text": " them arbitrarily:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.634607+00:00",
    "data": {
      "text": " a sw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.655945+00:00",
    "data": {
      "text": "arm can become"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.680574+00:00",
    "data": {
      "text": " a tool"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.700812+00:00",
    "data": {
      "text": " inside a delegate, a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.724293+00:00",
    "data": {
      "text": " delegate can be a node inside"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.745208+00:00",
    "data": {
      "text": " a graph,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.767350+00:00",
    "data": {
      "text": " and so"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.789080+00:00",
    "data": {
      "text": " on."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.810940+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.832960+00:00",
    "data": {
      "text": "ands-compose figures"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.863122+00:00",
    "data": {
      "text": " out the correct"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.884370+00:00",
    "data": {
      "text": " buil"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.905888+00:00",
    "data": {
      "text": "d order and wires"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.927470+00:00",
    "data": {
      "text": " everything"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.949038+00:00",
    "data": {
      "text": " up"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.970881+00:00",
    "data": {
      "text": ".\n\n---\n\n## Core"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:20.993336+00:00",
    "data": {
      "text": " Technical"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.015240+00:00",
    "data": {
      "text": " Building"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.055377+00:00",
    "data": {
      "text": " Blocks\n\n### **"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.058631+00:00",
    "data": {
      "text": "Tools"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.087368+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.103877+00:00",
    "data": {
      "text": "\nTools"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.125637+00:00",
    "data": {
      "text": " are plain"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.147525+00:00",
    "data": {
      "text": " Python functions decorate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.169016+00:00",
    "data": {
      "text": "d with str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.191222+00:00",
    "data": {
      "text": "ands'"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.212782+00:00",
    "data": {
      "text": " `@tool`."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.236755+00:00",
    "data": {
      "text": " The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.269801+00:00",
    "data": {
      "text": " "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.286268+00:00",
    "data": {
      "text": "docstring becomes"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.310984+00:00",
    "data": {
      "text": " the tool description"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.341344+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.362484+00:00",
    "data": {
      "text": " model"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.384804+00:00",
    "data": {
      "text": " reads"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.406559+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.427877+00:00",
    "data": {
      "text": " and type"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.450119+00:00",
    "data": {
      "text": " hints become the parameter"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.473344+00:00",
    "data": {
      "text": " schema"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.495389+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.517062+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.538801+00:00",
    "data": {
      "text": "ands-compose discovers"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.560233+00:00",
    "data": {
      "text": " them"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.582284+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.604070+00:00",
    "data": {
      "text": "d gives"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.626268+00:00",
    "data": {
      "text": " agents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.647269+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.669152+00:00",
    "data": {
      "text": " ability to call"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.691373+00:00",
    "data": {
      "text": " them."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.721290+00:00",
    "data": {
      "text": " Each"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.743308+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.764595+00:00",
    "data": {
      "text": " gets"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.786705+00:00",
    "data": {
      "text": " its own independent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.811202+00:00",
    "data": {
      "text": " copy"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.833366+00:00",
    "data": {
      "text": " of tools"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.863740+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.884545+00:00",
    "data": {
      "text": " no shared state between"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.906573+00:00",
    "data": {
      "text": " agents.\n\n### **Hooks**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.927974+00:00",
    "data": {
      "text": "\nHooks are lifecycle"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.950441+00:00",
    "data": {
      "text": " callbacks"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.975613+00:00",
    "data": {
      "text": " that fire"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:21.994388+00:00",
    "data": {
      "text": " at"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.015465+00:00",
    "data": {
      "text": " define"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.060033+00:00",
    "data": {
      "text": "d points:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.061259+00:00",
    "data": {
      "text": " before/"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.081699+00:00",
    "data": {
      "text": "after inv"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.111235+00:00",
    "data": {
      "text": "oc"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.133532+00:00",
    "data": {
      "text": "ations, before"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.155078+00:00",
    "data": {
      "text": "/after model"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.180889+00:00",
    "data": {
      "text": " calls"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.204207+00:00",
    "data": {
      "text": ", before/after tool calls. They"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.223902+00:00",
    "data": {
      "text": " are"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.247130+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.267406+00:00",
    "data": {
      "text": " right"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.288851+00:00",
    "data": {
      "text": " place for"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.310539+00:00",
    "data": {
      "text": " cross"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.332252+00:00",
    "data": {
      "text": "-cutting"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.354344+00:00",
    "data": {
      "text": " concerns like guar"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.376003+00:00",
    "data": {
      "text": "drails, audit"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.397728+00:00",
    "data": {
      "text": " logging"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.419703+00:00",
    "data": {
      "text": ", cost"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.449518+00:00",
    "data": {
      "text": " tracking, an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.471369+00:00",
    "data": {
      "text": "d rate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.493052+00:00",
    "data": {
      "text": " limiting."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.539435+00:00",
    "data": {
      "text": " Hooks fire"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.567708+00:00",
    "data": {
      "text": " in the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.584725+00:00",
    "data": {
      "text": " order liste"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.610592+00:00",
    "data": {
      "text": "d, and each agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.631810+00:00",
    "data": {
      "text": " gets fresh"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.653462+00:00",
    "data": {
      "text": " hook"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.980937+00:00",
    "data": {
      "text": " instances.\n\n### **Sessions"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.981522+00:00",
    "data": {
      "text": "**\nBy"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.981895+00:00",
    "data": {
      "text": " default, agents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.983844+00:00",
    "data": {
      "text": " are stat"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.984865+00:00",
    "data": {
      "text": "eless. A"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.987592+00:00",
    "data": {
      "text": " session manager"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.987686+00:00",
    "data": {
      "text": " adds"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.987762+00:00",
    "data": {
      "text": " persistent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.988324+00:00",
    "data": {
      "text": " conversation"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.988407+00:00",
    "data": {
      "text": " history across"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.988478+00:00",
    "data": {
      "text": " multiple"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.990815+00:00",
    "data": {
      "text": " turns"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.990897+00:00",
    "data": {
      "text": ". Sessions"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:22.990960+00:00",
    "data": {
      "text": " can"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.008226+00:00",
    "data": {
      "text": " be set"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.017920+00:00",
    "data": {
      "text": " globally"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.040298+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.062216+00:00",
    "data": {
      "text": "every"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.083038+00:00",
    "data": {
      "text": " agent inher"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.105605+00:00",
    "data": {
      "text": "its it"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.126631+00:00",
    "data": {
      "text": ") or per agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.148315+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.170148+00:00",
    "data": {
      "text": " Backends"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.191738+00:00",
    "data": {
      "text": " include"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.235815+00:00",
    "data": {
      "text": " local"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.237159+00:00",
    "data": {
      "text": " filesystem"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.257641+00:00",
    "data": {
      "text": ", Amazon"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.289558+00:00",
    "data": {
      "text": " S"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.309345+00:00",
    "data": {
      "text": "3, an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.353795+00:00",
    "data": {
      "text": "d Be"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.376680+00:00",
    "data": {
      "text": "drock AgentCore Memory"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.399472+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.456341+00:00",
    "data": {
      "text": " Note"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.485237+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.531443+00:00",
    "data": {
      "text": " Agents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.550708+00:00",
    "data": {
      "text": " in"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.572551+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.594691+00:00",
    "data": {
      "text": " sw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.616207+00:00",
    "data": {
      "text": "arm cannot"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.637088+00:00",
    "data": {
      "text": " use"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.658767+00:00",
    "data": {
      "text": " session"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.680162+00:00",
    "data": {
      "text": " managers"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.702186+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.723681+00:00",
    "data": {
      "text": "a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.766283+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.775393+00:00",
    "data": {
      "text": "ands limitation"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.797404+00:00",
    "data": {
      "text": ").\n\n### **Native"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.818907+00:00",
    "data": {
      "text": " Objects"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.840812+00:00",
    "data": {
      "text": " —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.867741+00:00",
    "data": {
      "text": " The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.885452+00:00",
    "data": {
      "text": " Key"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.919564+00:00",
    "data": {
      "text": " Insight**\nWhen"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.937404+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.959316+00:00",
    "data": {
      "text": "ands-compose builds your system"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:23.981196+00:00",
    "data": {
      "text": ", it does"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.005125+00:00",
    "data": {
      "text": " two"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.028656+00:00",
    "data": {
      "text": " distinct"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.048373+00:00",
    "data": {
      "text": " steps"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.090311+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.092151+00:00",
    "data": {
      "text": "\n1. **Resolution"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.113612+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.135266+00:00",
    "data": {
      "text": " — turning"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.181676+00:00",
    "data": {
      "text": " YAML into objects"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.204477+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.226453+00:00",
    "data": {
      "text": " interpol"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.247535+00:00",
    "data": {
      "text": "ate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.270005+00:00",
    "data": {
      "text": " variables"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.289878+00:00",
    "data": {
      "text": ", validate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.311882+00:00",
    "data": {
      "text": " structure"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.333034+00:00",
    "data": {
      "text": ", start"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.357003+00:00",
    "data": {
      "text": " M"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.376774+00:00",
    "data": {
      "text": "CP servers,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.400803+00:00",
    "data": {
      "text": " buil"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.420539+00:00",
    "data": {
      "text": "d agents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.442258+00:00",
    "data": {
      "text": " with"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.486525+00:00",
    "data": {
      "text": " their models"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.493899+00:00",
    "data": {
      "text": ", tools"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.515499+00:00",
    "data": {
      "text": ", hooks"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.538301+00:00",
    "data": {
      "text": ", and session"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.558535+00:00",
    "data": {
      "text": " managers"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.580684+00:00",
    "data": {
      "text": ".\n2. **W"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.602469+00:00",
    "data": {
      "text": "iring** — connecting those parts"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.624038+00:00",
    "data": {
      "text": " into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.647021+00:00",
    "data": {
      "text": " one"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.690731+00:00",
    "data": {
      "text": " coher"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.692321+00:00",
    "data": {
      "text": "ent system:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.710674+00:00",
    "data": {
      "text": " agents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.733326+00:00",
    "data": {
      "text": " become"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.754224+00:00",
    "data": {
      "text": " each"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.776305+00:00",
    "data": {
      "text": " other's capabilities"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.797501+00:00",
    "data": {
      "text": ", M"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.819375+00:00",
    "data": {
      "text": "CP clients are"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.841058+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.862632+00:00",
    "data": {
      "text": "ired to"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.884642+00:00",
    "data": {
      "text": " agents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.906244+00:00",
    "data": {
      "text": " as"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.930601+00:00",
    "data": {
      "text": " tool"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.950110+00:00",
    "data": {
      "text": " providers"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:24.979343+00:00",
    "data": {
      "text": ", and the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.002566+00:00",
    "data": {
      "text": " event"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.022155+00:00",
    "data": {
      "text": " stream is thre"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.043930+00:00",
    "data": {
      "text": "aded into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.065793+00:00",
    "data": {
      "text": " every"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.087308+00:00",
    "data": {
      "text": " agent an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.108662+00:00",
    "data": {
      "text": "d orchestrator.\n\nAfter"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.131320+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.152477+00:00",
    "data": {
      "text": "iring, what"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.174236+00:00",
    "data": {
      "text": " you hol"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.195887+00:00",
    "data": {
      "text": "d are **real"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.217793+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.247636+00:00",
    "data": {
      "text": " native strands objects**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.270527+00:00",
    "data": {
      "text": " — not"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.291319+00:00",
    "data": {
      "text": " wrappe"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.312983+00:00",
    "data": {
      "text": "d,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.334856+00:00",
    "data": {
      "text": " not proxied, not hidden"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.356588+00:00",
    "data": {
      "text": " behind a framework. Nothing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.378567+00:00",
    "data": {
      "text": " interc"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.399908+00:00",
    "data": {
      "text": "epts calls"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.421877+00:00",
    "data": {
      "text": " at"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.443200+00:00",
    "data": {
      "text": " runtime. The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.464907+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.486663+00:00",
    "data": {
      "text": "iring is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.508149+00:00",
    "data": {
      "text": " structural"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.530073+00:00",
    "data": {
      "text": " ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.551752+00:00",
    "data": {
      "text": "who"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.574959+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.595197+00:00",
    "data": {
      "text": " connected to whom), not a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.616774+00:00",
    "data": {
      "text": " proxy layer"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.638899+00:00",
    "data": {
      "text": ".\n\n---\n\n## A"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.682506+00:00",
    "data": {
      "text": " Concrete"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.704448+00:00",
    "data": {
      "text": " Example:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.728590+00:00",
    "data": {
      "text": " Delegate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.748178+00:00",
    "data": {
      "text": " with"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.768901+00:00",
    "data": {
      "text": " Custom"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.790772+00:00",
    "data": {
      "text": " Tools\n\nLet me"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.812695+00:00",
    "data": {
      "text": " show you how simple"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.834157+00:00",
    "data": {
      "text": " it is in"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.855944+00:00",
    "data": {
      "text": " practice."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.877554+00:00",
    "data": {
      "text": " This"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.905575+00:00",
    "data": {
      "text": " example demonstrates a **"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.922075+00:00",
    "data": {
      "text": "delegate orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.942977+00:00",
    "data": {
      "text": "ration** with"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.964723+00:00",
    "data": {
      "text": " two"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:25.986327+00:00",
    "data": {
      "text": " agents:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.008293+00:00",
    "data": {
      "text": " a coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.030413+00:00",
    "data": {
      "text": " and a specialist."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.053277+00:00",
    "data": {
      "text": " The coordinator has"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.073770+00:00",
    "data": {
      "text": " a `"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.095523+00:00",
    "data": {
      "text": "lookup_data` tool,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.116677+00:00",
    "data": {
      "text": " and the specialist has a `format_"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.138198+00:00",
    "data": {
      "text": "result` tool."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.159720+00:00",
    "data": {
      "text": " The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.182331+00:00",
    "data": {
      "text": " coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.203476+00:00",
    "data": {
      "text": " calls the specialist as a tool to"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.224761+00:00",
    "data": {
      "text": " format"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.246854+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.267969+00:00",
    "data": {
      "text": " data"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.309460+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.311494+00:00",
    "data": {
      "text": " retri"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.333305+00:00",
    "data": {
      "text": "eves.\n\n### **config"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.355871+00:00",
    "data": {
      "text": ".yaml**\n```yaml\nmodels"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.376916+00:00",
    "data": {
      "text": ":\n  default"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.399009+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.420650+00:00",
    "data": {
      "text": "\n    provider"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.441718+00:00",
    "data": {
      "text": ": be"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.463563+00:00",
    "data": {
      "text": "drock\n    model_"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.485897+00:00",
    "data": {
      "text": "i"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.506802+00:00",
    "data": {
      "text": "d: open"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.528724+00:00",
    "data": {
      "text": "ai."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.550427+00:00",
    "data": {
      "text": "g"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.573578+00:00",
    "data": {
      "text": "pt-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.594253+00:00",
    "data": {
      "text": "oss"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.617489+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.639250+00:00",
    "data": {
      "text": "20"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.660850+00:00",
    "data": {
      "text": "b"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.682951+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.704799+00:00",
    "data": {
      "text": "1"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.749727+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.750093+00:00",
    "data": {
      "text": "0"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.791509+00:00",
    "data": {
      "text": "\n\nagents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.813483+00:00",
    "data": {
      "text": ":\n  specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.857582+00:00",
    "data": {
      "text": ":\n    model"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.862615+00:00",
    "data": {
      "text": ": default\n    tools:\n      "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.878346+00:00",
    "data": {
      "text": "- ./"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.900505+00:00",
    "data": {
      "text": "tools."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.922078+00:00",
    "data": {
      "text": "py:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.944537+00:00",
    "data": {
      "text": "format"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.968193+00:00",
    "data": {
      "text": "_result\n    "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:26.986861+00:00",
    "data": {
      "text": "system"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.008630+00:00",
    "data": {
      "text": "_prompt: |\n      You format"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.030473+00:00",
    "data": {
      "text": " data into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.052147+00:00",
    "data": {
      "text": " clean"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.076767+00:00",
    "data": {
      "text": " output"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.098101+00:00",
    "data": {
      "text": ".\n      Use"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.124202+00:00",
    "data": {
      "text": " your"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.141955+00:00",
    "data": {
      "text": " format"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.163083+00:00",
    "data": {
      "text": "_result tool to structure"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.184974+00:00",
    "data": {
      "text": " the response"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.206279+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.228196+00:00",
    "data": {
      "text": "\n\n  coordinator:\n    model: default"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.250096+00:00",
    "data": {
      "text": "\n    tools:\n      - ./"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.271376+00:00",
    "data": {
      "text": "tools.py:lookup_data"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.293167+00:00",
    "data": {
      "text": "\n    system_prompt: |\n      "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.315338+00:00",
    "data": {
      "text": "You coordinate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.336594+00:00",
    "data": {
      "text": " data"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.359032+00:00",
    "data": {
      "text": " retrieval an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.380086+00:00",
    "data": {
      "text": "d formatting.\n      1"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.401976+00:00",
    "data": {
      "text": ". Call"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.423908+00:00",
    "data": {
      "text": " lookup_data to fetch"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.445526+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.467339+00:00",
    "data": {
      "text": " information"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.489959+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.518968+00:00",
    "data": {
      "text": "\n      2. Pass"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.541189+00:00",
    "data": {
      "text": " the result"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.563124+00:00",
    "data": {
      "text": " to specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.583812+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.763354+00:00",
    "data": {
      "text": " format it.\n      3. Return"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.764070+00:00",
    "data": {
      "text": " the formatted output"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.764220+00:00",
    "data": {
      "text": ".\n\norchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.765044+00:00",
    "data": {
      "text": "rations"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.765085+00:00",
    "data": {
      "text": ":\n  main"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.765900+00:00",
    "data": {
      "text": ":\n    mode"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.766057+00:00",
    "data": {
      "text": ": delegate\n    entry"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.766702+00:00",
    "data": {
      "text": "_name"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.779840+00:00",
    "data": {
      "text": ": coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.801774+00:00",
    "data": {
      "text": "\n    connections"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.823326+00:00",
    "data": {
      "text": ":\n      - agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.845075+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.867383+00:00",
    "data": {
      "text": " specialist\n        description"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.917043+00:00",
    "data": {
      "text": ": \""
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.950402+00:00",
    "data": {
      "text": "Format"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:27.975373+00:00",
    "data": {
      "text": " raw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.094007+00:00",
    "data": {
      "text": " data into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.094469+00:00",
    "data": {
      "text": " clean structure"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.095084+00:00",
    "data": {
      "text": "d output.\""
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.095629+00:00",
    "data": {
      "text": "\n\nentry"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.128297+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.129230+00:00",
    "data": {
      "text": " main\n```\n\n### **tools."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.150861+00:00",
    "data": {
      "text": "py**\n```python\nfrom"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.172829+00:00",
    "data": {
      "text": " strands."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.198480+00:00",
    "data": {
      "text": "tools"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.216019+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.260021+00:00",
    "data": {
      "text": "decorator"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.260902+00:00",
    "data": {
      "text": " import tool\n\n@tool\ndef lookup"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.281188+00:00",
    "data": {
      "text": "_data(query"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.303283+00:00",
    "data": {
      "text": ": str) -> str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.325148+00:00",
    "data": {
      "text": ":\n    \"\"\"Fetch data for"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.347241+00:00",
    "data": {
      "text": " a query"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.368678+00:00",
    "data": {
      "text": ".\"\"\""
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.392895+00:00",
    "data": {
      "text": "\n    return"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.425641+00:00",
    "data": {
      "text": " f\"Raw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.434053+00:00",
    "data": {
      "text": " data for '{"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.455620+00:00",
    "data": {
      "text": "query}"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.477104+00:00",
    "data": {
      "text": "':"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.503626+00:00",
    "data": {
      "text": " ["
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.520484+00:00",
    "data": {
      "text": "ID"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.542392+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.589157+00:00",
    "data": {
      "text": "42"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.590441+00:00",
    "data": {
      "text": ", Status"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.606981+00:00",
    "data": {
      "text": ":Active"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.629391+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.650807+00:00",
    "data": {
      "text": " Score"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.672911+00:00",
    "data": {
      "text": ":95"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.694313+00:00",
    "data": {
      "text": "]\"\n\n@tool\ndef format"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.715532+00:00",
    "data": {
      "text": "_result(data: str) ->"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.737272+00:00",
    "data": {
      "text": " str:\n    \"\"\"Format raw data"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.759056+00:00",
    "data": {
      "text": " into clean output.\"\"\"\n    return"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.780830+00:00",
    "data": {
      "text": " f\""
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.802580+00:00",
    "data": {
      "text": "✓"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.824593+00:00",
    "data": {
      "text": " Formatted: {data."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.846326+00:00",
    "data": {
      "text": "upper"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.867682+00:00",
    "data": {
      "text": "()}\"\n```\n\n### **What"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.889816+00:00",
    "data": {
      "text": "'s"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.911215+00:00",
    "data": {
      "text": " Happening Here"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.932788+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.954575+00:00",
    "data": {
      "text": "\n\n1. **The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.978253+00:00",
    "data": {
      "text": " config"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:28.999729+00:00",
    "data": {
      "text": " defines"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.039830+00:00",
    "data": {
      "text": " two"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.042180+00:00",
    "data": {
      "text": " agents:**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.062610+00:00",
    "data": {
      "text": " `specialist` and `coordinator`."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.084349+00:00",
    "data": {
      "text": " Each"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.106594+00:00",
    "data": {
      "text": " has its"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.127849+00:00",
    "data": {
      "text": " own model, tools, and system prompt"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.150146+00:00",
    "data": {
      "text": ".\n\n2. **The coordinator has"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.173791+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.193157+00:00",
    "data": {
      "text": "lookup_data`"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.214887+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.236357+00:00",
    "data": {
      "text": " — a tool that fetches raw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.258221+00:00",
    "data": {
      "text": " data."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.282282+00:00",
    "data": {
      "text": "\n\n3. **The specialist has `"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.302206+00:00",
    "data": {
      "text": "format_result`** — a tool"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.323654+00:00",
    "data": {
      "text": " that cl"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.345351+00:00",
    "data": {
      "text": "eans up"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.369933+00:00",
    "data": {
      "text": " data"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.391263+00:00",
    "data": {
      "text": ".\n\n4. **The orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.413325+00:00",
    "data": {
      "text": "ration is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.435346+00:00",
    "data": {
      "text": " a delegate:**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.457037+00:00",
    "data": {
      "text": " The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.478260+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.499757+00:00",
    "data": {
      "text": "coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.521978+00:00",
    "data": {
      "text": "` is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.543472+00:00",
    "data": {
      "text": " the entry"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.565451+00:00",
    "data": {
      "text": " point, an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.590052+00:00",
    "data": {
      "text": "d the `specialist` is registere"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.608193+00:00",
    "data": {
      "text": "d as a connection"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.630756+00:00",
    "data": {
      "text": " with"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.660776+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.681967+00:00",
    "data": {
      "text": " description."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.706087+00:00",
    "data": {
      "text": " This"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.725479+00:00",
    "data": {
      "text": " means when the coordinator runs"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.748589+00:00",
    "data": {
      "text": ", it can"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.781517+00:00",
    "data": {
      "text": " call the specialist as a tool."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.802705+00:00",
    "data": {
      "text": "\n\n5. **No"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.824183+00:00",
    "data": {
      "text": " Python"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.846228+00:00",
    "data": {
      "text": " orchest"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.880145+00:00",
    "data": {
      "text": "ration code neede"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.889201+00:00",
    "data": {
      "text": "d."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.910855+00:00",
    "data": {
      "text": "** str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.932666+00:00",
    "data": {
      "text": "ands-compose reads"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.954698+00:00",
    "data": {
      "text": " the config, builds both"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.976644+00:00",
    "data": {
      "text": " agents, w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:29.999014+00:00",
    "data": {
      "text": "ires the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.020119+00:00",
    "data": {
      "text": " specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.049984+00:00",
    "data": {
      "text": " into"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.071716+00:00",
    "data": {
      "text": " the coordinator's"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.093533+00:00",
    "data": {
      "text": " tool list"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.114961+00:00",
    "data": {
      "text": ", and returns"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.136955+00:00",
    "data": {
      "text": " a"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.158867+00:00",
    "data": {
      "text": " ready"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.180446+00:00",
    "data": {
      "text": "-to-run system"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.202430+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.223795+00:00",
    "data": {
      "text": " You"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.245410+00:00",
    "data": {
      "text": " woul"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.267252+00:00",
    "data": {
      "text": "d use"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.289494+00:00",
    "data": {
      "text": " it"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.604922+00:00",
    "data": {
      "text": " like:\n\n```python\nfrom"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.606478+00:00",
    "data": {
      "text": " strands_compose import loa"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.606575+00:00",
    "data": {
      "text": "d\n\nsystem"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.608845+00:00",
    "data": {
      "text": " = load(\"config.yaml\")"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.609097+00:00",
    "data": {
      "text": "\nresponse"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.609729+00:00",
    "data": {
      "text": " = system.run"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.610709+00:00",
    "data": {
      "text": "(\"Please"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.610749+00:00",
    "data": {
      "text": " look"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.610780+00:00",
    "data": {
      "text": " up data for 'user"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.611378+00:00",
    "data": {
      "text": "123'"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.611869+00:00",
    "data": {
      "text": " and format it nic"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.612445+00:00",
    "data": {
      "text": "ely\")"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.612595+00:00",
    "data": {
      "text": "\nprint"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.612632+00:00",
    "data": {
      "text": "(response)\n```\n\nThat"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.630757+00:00",
    "data": {
      "text": "'s it."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.636829+00:00",
    "data": {
      "text": " The"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.658725+00:00",
    "data": {
      "text": " coordinator"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.680631+00:00",
    "data": {
      "text": " runs"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.701511+00:00",
    "data": {
      "text": ", calls"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.724768+00:00",
    "data": {
      "text": " `"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.745425+00:00",
    "data": {
      "text": "lookup"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.766833+00:00",
    "data": {
      "text": "_data`, gets"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.789027+00:00",
    "data": {
      "text": " raw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.810448+00:00",
    "data": {
      "text": " data, then"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.833456+00:00",
    "data": {
      "text": " calls the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.854623+00:00",
    "data": {
      "text": " specialist ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.876897+00:00",
    "data": {
      "text": "which is automatically"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.898387+00:00",
    "data": {
      "text": " available"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.920080+00:00",
    "data": {
      "text": " as a tool),"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.941914+00:00",
    "data": {
      "text": " and the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.963705+00:00",
    "data": {
      "text": " specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:30.984894+00:00",
    "data": {
      "text": " formats it."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.006375+00:00",
    "data": {
      "text": " All"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.030030+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.051083+00:00",
    "data": {
      "text": " w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.071548+00:00",
    "data": {
      "text": "iring —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.093425+00:00",
    "data": {
      "text": " making"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.123482+00:00",
    "data": {
      "text": " the specialist"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.144459+00:00",
    "data": {
      "text": " callable"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.166291+00:00",
    "data": {
      "text": " from"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.188269+00:00",
    "data": {
      "text": " the coordinator,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.211665+00:00",
    "data": {
      "text": " threading"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.233673+00:00",
    "data": {
      "text": " the event stream, managing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.255236+00:00",
    "data": {
      "text": " the conversation"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.277125+00:00",
    "data": {
      "text": " flow"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.298744+00:00",
    "data": {
      "text": " — is handled by strands-compose"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.332588+00:00",
    "data": {
      "text": ".\n\n---\n\n## Why"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.341956+00:00",
    "data": {
      "text": " This Matters"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.363862+00:00",
    "data": {
      "text": " for"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.386864+00:00",
    "data": {
      "text": " You"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.425915+00:00",
    "data": {
      "text": "\n\nIf"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.428557+00:00",
    "data": {
      "text": " you've"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.455896+00:00",
    "data": {
      "text": " built"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.472320+00:00",
    "data": {
      "text": " multi"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.494161+00:00",
    "data": {
      "text": "-agent systems with"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.516376+00:00",
    "data": {
      "text": " strands-agents"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.537299+00:00",
    "data": {
      "text": " before"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.559946+00:00",
    "data": {
      "text": ", you know"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.581159+00:00",
    "data": {
      "text": " the pain:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.602898+00:00",
    "data": {
      "text": " han"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.624552+00:00",
    "data": {
      "text": "d-writing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.646458+00:00",
    "data": {
      "text": " agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.668466+00:00",
    "data": {
      "text": " construction"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.689740+00:00",
    "data": {
      "text": ", w"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.711325+00:00",
    "data": {
      "text": "iring them"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.733154+00:00",
    "data": {
      "text": " as"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.754814+00:00",
    "data": {
      "text": " each"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.776677+00:00",
    "data": {
      "text": " other's tools"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.802132+00:00",
    "data": {
      "text": ", ordering"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.819361+00:00",
    "data": {
      "text": " startup"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.841343+00:00",
    "data": {
      "text": ","
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.863279+00:00",
    "data": {
      "text": " att"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.884959+00:00",
    "data": {
      "text": "aching hooks"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.906412+00:00",
    "data": {
      "text": ", threading"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.928541+00:00",
    "data": {
      "text": " sessions"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.953002+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.974518+00:00",
    "data": {
      "text": " That"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:31.996303+00:00",
    "data": {
      "text": " bo"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.017734+00:00",
    "data": {
      "text": "ilerplate grows"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.039066+00:00",
    "data": {
      "text": " quickly"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.062381+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.082928+00:00",
    "data": {
      "text": "d becomes har"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.104423+00:00",
    "data": {
      "text": "d to review"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.126166+00:00",
    "data": {
      "text": " an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.148215+00:00",
    "data": {
      "text": "d version"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.169892+00:00",
    "data": {
      "text": ".\n\nstrands-compose turns"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.191375+00:00",
    "data": {
      "text": " that"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.214244+00:00",
    "data": {
      "text": " boilerplate into **"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.243281+00:00",
    "data": {
      "text": "review"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.265380+00:00",
    "data": {
      "text": "able, versionable configuration"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.287044+00:00",
    "data": {
      "text": "**"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.309220+00:00",
    "data": {
      "text": ". Your"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.331295+00:00",
    "data": {
      "text": " entire"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.392226+00:00",
    "data": {
      "text": " agent topology"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.419892+00:00",
    "data": {
      "text": " is"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.443144+00:00",
    "data": {
      "text": " visible in one"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.465467+00:00",
    "data": {
      "text": " YAML file. You can:"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.484831+00:00",
    "data": {
      "text": "\n- **"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.528175+00:00",
    "data": {
      "text": "Commit it"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.554074+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.571053+00:00",
    "data": {
      "text": " Git** an"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.592715+00:00",
    "data": {
      "text": "d see"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.614830+00:00",
    "data": {
      "text": " "
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.644800+00:00",
    "data": {
      "text": "diffs when"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.666660+00:00",
    "data": {
      "text": " you change agent"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.688023+00:00",
    "data": {
      "text": " connections"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.710087+00:00",
    "data": {
      "text": " or"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.733723+00:00",
    "data": {
      "text": " tools.\n- **Reproduce"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.756410+00:00",
    "data": {
      "text": " bugs"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.779139+00:00",
    "data": {
      "text": "** by loading"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.798911+00:00",
    "data": {
      "text": " the exact config"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.820704+00:00",
    "data": {
      "text": " that"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.845698+00:00",
    "data": {
      "text": " triggere"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.863974+00:00",
    "data": {
      "text": "d them"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.900514+00:00",
    "data": {
      "text": ".\n- **Run"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.909627+00:00",
    "data": {
      "text": " experiments** by generating"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.931597+00:00",
    "data": {
      "text": " config"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.953805+00:00",
    "data": {
      "text": " variations and evalu"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.977352+00:00",
    "data": {
      "text": "ating them program"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:32.998718+00:00",
    "data": {
      "text": "matically.\n- **Deploy"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.020199+00:00",
    "data": {
      "text": " to"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.042187+00:00",
    "data": {
      "text": " AWS"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.087351+00:00",
    "data": {
      "text": " Bedrock Ag"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.106807+00:00",
    "data": {
      "text": "entCore** ("
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.130734+00:00",
    "data": {
      "text": "opt"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.150375+00:00",
    "data": {
      "text": "ionally,"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.172124+00:00",
    "data": {
      "text": " via"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.193911+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.215546+00:00",
    "data": {
      "text": " separate"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.237380+00:00",
    "data": {
      "text": " be"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.258589+00:00",
    "data": {
      "text": "drock-ag"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.280480+00:00",
    "data": {
      "text": "entcore adapter"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.302297+00:00",
    "data": {
      "text": ")"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.324303+00:00",
    "data": {
      "text": " without"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.345612+00:00",
    "data": {
      "text": " changing"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.366947+00:00",
    "data": {
      "text": " your core"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.388627+00:00",
    "data": {
      "text": " code.\n\nAn"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.411421+00:00",
    "data": {
      "text": "d because"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.431948+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.453726+00:00",
    "data": {
      "text": "ands-compose gives"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.477807+00:00",
    "data": {
      "text": " you back"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.502257+00:00",
    "data": {
      "text": " native"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.519601+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.540725+00:00",
    "data": {
      "text": "ands objects, you're"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.562441+00:00",
    "data": {
      "text": " never"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.584069+00:00",
    "data": {
      "text": " locke"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.610710+00:00",
    "data": {
      "text": "d in"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.627385+00:00",
    "data": {
      "text": "."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.648974+00:00",
    "data": {
      "text": " If"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.679605+00:00",
    "data": {
      "text": " you need to drop"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.696585+00:00",
    "data": {
      "text": " down"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.715035+00:00",
    "data": {
      "text": " to raw"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.736535+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.758245+00:00",
    "data": {
      "text": "ands APIs"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.779902+00:00",
    "data": {
      "text": " for"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.803613+00:00",
    "data": {
      "text": " something"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.823510+00:00",
    "data": {
      "text": " custom"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.844861+00:00",
    "data": {
      "text": ", you can —"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.868451+00:00",
    "data": {
      "text": " everything"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.888380+00:00",
    "data": {
      "text": " you"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.909917+00:00",
    "data": {
      "text": " know"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.931673+00:00",
    "data": {
      "text": " about str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.953554+00:00",
    "data": {
      "text": "ands still"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:33.974627+00:00",
    "data": {
      "text": " applies."
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.000061+00:00",
    "data": {
      "text": "\n\n---\n\nFor"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.029353+00:00",
    "data": {
      "text": " more"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.055250+00:00",
    "data": {
      "text": " details please"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.072169+00:00",
    "data": {
      "text": " visit"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.093876+00:00",
    "data": {
      "text": " the"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.115479+00:00",
    "data": {
      "text": " str"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.137240+00:00",
    "data": {
      "text": "ands-compose GitHub"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.158832+00:00",
    "data": {
      "text": " repos"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.180621+00:00",
    "data": {
      "text": ":"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.202622+00:00",
    "data": {
      "text": " https://github.com/strands"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.224154+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.246001+00:00",
    "data": {
      "text": "compose"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.276767+00:00",
    "data": {
      "text": "/sdk"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.306479+00:00",
    "data": {
      "text": "-"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.328153+00:00",
    "data": {
      "text": "python and https://github.com/"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.350517+00:00",
    "data": {
      "text": "strands-compose/be"
    }
  },
  {
    "type": "token",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.375961+00:00",
    "data": {
      "text": "drock-agentcore"
    }
  },
  {
    "type": "agent_complete",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.525942+00:00",
    "data": {
      "usage": {
        "input_tokens": 19362,
        "output_tokens": 3227,
        "total_tokens": 22589
      },
      "text": "Perfect! Now I have all the pieces. Let me synthesize this into a comprehensive, well-structured answer for the user.\n\n---\n\n## I am demo agent of strands-compose. I cannot answer your specific questions, \nhowever let me present what strands-compose is, what does it bring to the table \nand how you can use it\n\n---\n\n## What strands-compose Is\n\n**strands-compose is a declarative configuration layer for building multi-agent systems.** Think of it like Docker Compose, but for AI agents. You describe your entire agent network in a YAML file — including models, tools, hooks, MCP servers, and how agents orchestrate together — and strands-compose resolves, validates, and wires everything into a working system.\n\nThe core insight is this: **strands-compose is not a framework that sits between you and strands at runtime.** Instead, it is a *composition and wiring layer*. After `load()`, what you get back are plain, native strands objects — real `strands.Agent` instances, real orchestrators like `strands.multiagent.Swarm` or `Graph`, real MCP clients. Once built, strands-compose steps out of the way. You interact with standard strands APIs, exactly as documented.\n\n### The Two Packages\n\nstrands-compose ships as **two separate packages**:\n\n| Package | GitHub | Purpose | Required? |\n|---------|--------|---------|-----------|\n| **strands-compose** (sdk-python) | https://github.com/strands-compose/sdk-python | Core library: YAML parsing, validation, agent/orchestration building, wiring, streaming | **Yes** — this is what you build with |\n| **strands-compose-agentcore** (bedrock-agentcore) | https://github.com/strands-compose/bedrock-agentcore | Optional adapter for deploying to AWS Bedrock AgentCore | **No** — only if you want managed cloud deployment |\n\n**The key point:** You can use strands-compose entirely standalone on your laptop or in your own infrastructure. The bedrock-agentcore adapter is purely optional and only comes into play if you decide to deploy to AWS Bedrock AgentCore for managed hosting.\n\n---\n\n## Why It Matters — Unique Benefits\n\n| Benefit | What It Means | Why It Matters |\n|---------|---------------|----------------|\n| **No wrappers — native strands objects** | After `load()`, you hold real `strands.Agent`, real `Swarm`, real `Graph` instances. No proxies, no framework layer at runtime. | If you know strands, you already know strands-compose. Full access to the strands API. No lock-in. |\n| **Configuration as data** | Your entire agent network lives in YAML (plus small Python files for custom tools). Commit to Git, diff versions, see exactly what changed. | Reproducibility, versioning, automated experiments. A bug report comes with its exact config; load it, replay it, debug it. |\n| **Unified streaming across the entire system** | One call wires an event publisher into every agent and orchestrator at any depth, funneling everything into one uniform stream. | No topology-specific code. Whether you have one agent or a delegate containing a swarm containing a graph three levels deep, you get one stream with consistent event shapes. |\n| **Composable orchestrations** | You can nest the three orchestration styles arbitrarily: delegate (hub-and-spoke), swarm (peer collaboration), and graph (deterministic pipeline). | Build complex, hierarchical agent systems without hand-writing plumbing code. A swarm can be a tool inside a delegate; a delegate can be a node in a graph. |\n| **Reviewable, versionable agent systems** | Your agent topology, tool wiring, hook order, and model choices are all visible in one place. | Teams can review agent systems like code. Changes are auditable. Reproducible across environments. |\n\n---\n\n## The Three Orchestration Modes\n\nstrands-compose supports three ways to orchestrate multiple agents:\n\n**1. Delegate (Hub-and-spoke)**  \nOne coordinator agent treats other agents as tools it can call. The coordinator has explicit control over who does what and when.  \n*When to use:* You want a \"boss\" making decisions about task flow. Example: a manager agent that decides whether to route a request to a sales agent, support agent, or technical specialist.\n\n**2. Swarm (Peer collaboration)**  \nAgents hand control off to each other autonomously, with no central coordinator. They negotiate and collaborate directly.  \n*When to use:* Negotiation-style loops like draft → review → revise. Example: a writer agent drafts content, a reviewer agent critiques it, and they iterate back and forth until satisfied.\n\n**3. Graph (Deterministic pipeline)**  \nAgents run in a fixed dependency order (a DAG — directed acyclic graph), and independent steps can run in parallel.  \n*When to use:* When you know the exact processing order upfront. Example: a data pipeline where one agent extracts data, another validates it, and a third transforms it.\n\n**Crucially:** These are not separate products — they are building blocks that click together. You can nest them arbitrarily: a swarm can become a tool inside a delegate, a delegate can be a node inside a graph, and so on. strands-compose figures out the correct build order and wires everything up.\n\n---\n\n## Core Technical Building Blocks\n\n### **Tools**\nTools are plain Python functions decorated with strands' `@tool`. The docstring becomes the tool description the model reads, and type hints become the parameter schema. strands-compose discovers them and gives agents the ability to call them. Each agent gets its own independent copy of tools — no shared state between agents.\n\n### **Hooks**\nHooks are lifecycle callbacks that fire at defined points: before/after invocations, before/after model calls, before/after tool calls. They are the right place for cross-cutting concerns like guardrails, audit logging, cost tracking, and rate limiting. Hooks fire in the order listed, and each agent gets fresh hook instances.\n\n### **Sessions**\nBy default, agents are stateless. A session manager adds persistent conversation history across multiple turns. Sessions can be set globally (every agent inherits it) or per agent. Backends include local filesystem, Amazon S3, and Bedrock AgentCore Memory. Note: Agents in a swarm cannot use session managers (a strands limitation).\n\n### **Native Objects — The Key Insight**\nWhen strands-compose builds your system, it does two distinct steps:\n1. **Resolution** — turning YAML into objects: interpolate variables, validate structure, start MCP servers, build agents with their models, tools, hooks, and session managers.\n2. **Wiring** — connecting those parts into one coherent system: agents become each other's capabilities, MCP clients are wired to agents as tool providers, and the event stream is threaded into every agent and orchestrator.\n\nAfter wiring, what you hold are **real, native strands objects** — not wrapped, not proxied, not hidden behind a framework. Nothing intercepts calls at runtime. The wiring is structural (who is connected to whom), not a proxy layer.\n\n---\n\n## A Concrete Example: Delegate with Custom Tools\n\nLet me show you how simple it is in practice. This example demonstrates a **delegate orchestration** with two agents: a coordinator and a specialist. The coordinator has a `lookup_data` tool, and the specialist has a `format_result` tool. The coordinator calls the specialist as a tool to format the data it retrieves.\n\n### **config.yaml**\n```yaml\nmodels:\n  default:\n    provider: bedrock\n    model_id: openai.gpt-oss-20b-1:0\n\nagents:\n  specialist:\n    model: default\n    tools:\n      - ./tools.py:format_result\n    system_prompt: |\n      You format data into clean output.\n      Use your format_result tool to structure the response.\n\n  coordinator:\n    model: default\n    tools:\n      - ./tools.py:lookup_data\n    system_prompt: |\n      You coordinate data retrieval and formatting.\n      1. Call lookup_data to fetch the information.\n      2. Pass the result to specialist to format it.\n      3. Return the formatted output.\n\norchestrations:\n  main:\n    mode: delegate\n    entry_name: coordinator\n    connections:\n      - agent: specialist\n        description: \"Format raw data into clean structured output.\"\n\nentry: main\n```\n\n### **tools.py**\n```python\nfrom strands.tools.decorator import tool\n\n@tool\ndef lookup_data(query: str) -> str:\n    \"\"\"Fetch data for a query.\"\"\"\n    return f\"Raw data for '{query}': [ID:42, Status:Active, Score:95]\"\n\n@tool\ndef format_result(data: str) -> str:\n    \"\"\"Format raw data into clean output.\"\"\"\n    return f\"✓ Formatted: {data.upper()}\"\n```\n\n### **What's Happening Here**\n\n1. **The config defines two agents:** `specialist` and `coordinator`. Each has its own model, tools, and system prompt.\n\n2. **The coordinator has `lookup_data`** — a tool that fetches raw data.\n\n3. **The specialist has `format_result`** — a tool that cleans up data.\n\n4. **The orchestration is a delegate:** The `coordinator` is the entry point, and the `specialist` is registered as a connection with a description. This means when the coordinator runs, it can call the specialist as a tool.\n\n5. **No Python orchestration code needed.** strands-compose reads the config, builds both agents, wires the specialist into the coordinator's tool list, and returns a ready-to-run system. You would use it like:\n\n```python\nfrom strands_compose import load\n\nsystem = load(\"config.yaml\")\nresponse = system.run(\"Please look up data for 'user123' and format it nicely\")\nprint(response)\n```\n\nThat's it. The coordinator runs, calls `lookup_data`, gets raw data, then calls the specialist (which is automatically available as a tool), and the specialist formats it. All the wiring — making the specialist callable from the coordinator, threading the event stream, managing the conversation flow — is handled by strands-compose.\n\n---\n\n## Why This Matters for You\n\nIf you've built multi-agent systems with strands-agents before, you know the pain: hand-writing agent construction, wiring them as each other's tools, ordering startup, attaching hooks, threading sessions. That boilerplate grows quickly and becomes hard to review and version.\n\nstrands-compose turns that boilerplate into **reviewable, versionable configuration**. Your entire agent topology is visible in one YAML file. You can:\n- **Commit it to Git** and see diffs when you change agent connections or tools.\n- **Reproduce bugs** by loading the exact config that triggered them.\n- **Run experiments** by generating config variations and evaluating them programmatically.\n- **Deploy to AWS Bedrock AgentCore** (optionally, via the separate bedrock-agentcore adapter) without changing your core code.\n\nAnd because strands-compose gives you back native strands objects, you're never locked in. If you need to drop down to raw strands APIs for something custom, you can — everything you know about strands still applies.\n\n---\n\nFor more details please visit the strands-compose GitHub repos: https://github.com/strands-compose/sdk-python and https://github.com/strands-compose/bedrock-agentcore\n",
      "message": {
        "role": "assistant",
        "content": [
          {
            "text": "Perfect! Now I have all the pieces. Let me synthesize this into a comprehensive, well-structured answer for the user.\n\n---\n\n## I am demo agent of strands-compose. I cannot answer your specific questions, \nhowever let me present what strands-compose is, what does it bring to the table \nand how you can use it\n\n---\n\n## What strands-compose Is\n\n**strands-compose is a declarative configuration layer for building multi-agent systems.** Think of it like Docker Compose, but for AI agents. You describe your entire agent network in a YAML file — including models, tools, hooks, MCP servers, and how agents orchestrate together — and strands-compose resolves, validates, and wires everything into a working system.\n\nThe core insight is this: **strands-compose is not a framework that sits between you and strands at runtime.** Instead, it is a *composition and wiring layer*. After `load()`, what you get back are plain, native strands objects — real `strands.Agent` instances, real orchestrators like `strands.multiagent.Swarm` or `Graph`, real MCP clients. Once built, strands-compose steps out of the way. You interact with standard strands APIs, exactly as documented.\n\n### The Two Packages\n\nstrands-compose ships as **two separate packages**:\n\n| Package | GitHub | Purpose | Required? |\n|---------|--------|---------|-----------|\n| **strands-compose** (sdk-python) | https://github.com/strands-compose/sdk-python | Core library: YAML parsing, validation, agent/orchestration building, wiring, streaming | **Yes** — this is what you build with |\n| **strands-compose-agentcore** (bedrock-agentcore) | https://github.com/strands-compose/bedrock-agentcore | Optional adapter for deploying to AWS Bedrock AgentCore | **No** — only if you want managed cloud deployment |\n\n**The key point:** You can use strands-compose entirely standalone on your laptop or in your own infrastructure. The bedrock-agentcore adapter is purely optional and only comes into play if you decide to deploy to AWS Bedrock AgentCore for managed hosting.\n\n---\n\n## Why It Matters — Unique Benefits\n\n| Benefit | What It Means | Why It Matters |\n|---------|---------------|----------------|\n| **No wrappers — native strands objects** | After `load()`, you hold real `strands.Agent`, real `Swarm`, real `Graph` instances. No proxies, no framework layer at runtime. | If you know strands, you already know strands-compose. Full access to the strands API. No lock-in. |\n| **Configuration as data** | Your entire agent network lives in YAML (plus small Python files for custom tools). Commit to Git, diff versions, see exactly what changed. | Reproducibility, versioning, automated experiments. A bug report comes with its exact config; load it, replay it, debug it. |\n| **Unified streaming across the entire system** | One call wires an event publisher into every agent and orchestrator at any depth, funneling everything into one uniform stream. | No topology-specific code. Whether you have one agent or a delegate containing a swarm containing a graph three levels deep, you get one stream with consistent event shapes. |\n| **Composable orchestrations** | You can nest the three orchestration styles arbitrarily: delegate (hub-and-spoke), swarm (peer collaboration), and graph (deterministic pipeline). | Build complex, hierarchical agent systems without hand-writing plumbing code. A swarm can be a tool inside a delegate; a delegate can be a node in a graph. |\n| **Reviewable, versionable agent systems** | Your agent topology, tool wiring, hook order, and model choices are all visible in one place. | Teams can review agent systems like code. Changes are auditable. Reproducible across environments. |\n\n---\n\n## The Three Orchestration Modes\n\nstrands-compose supports three ways to orchestrate multiple agents:\n\n**1. Delegate (Hub-and-spoke)**  \nOne coordinator agent treats other agents as tools it can call. The coordinator has explicit control over who does what and when.  \n*When to use:* You want a \"boss\" making decisions about task flow. Example: a manager agent that decides whether to route a request to a sales agent, support agent, or technical specialist.\n\n**2. Swarm (Peer collaboration)**  \nAgents hand control off to each other autonomously, with no central coordinator. They negotiate and collaborate directly.  \n*When to use:* Negotiation-style loops like draft → review → revise. Example: a writer agent drafts content, a reviewer agent critiques it, and they iterate back and forth until satisfied.\n\n**3. Graph (Deterministic pipeline)**  \nAgents run in a fixed dependency order (a DAG — directed acyclic graph), and independent steps can run in parallel.  \n*When to use:* When you know the exact processing order upfront. Example: a data pipeline where one agent extracts data, another validates it, and a third transforms it.\n\n**Crucially:** These are not separate products — they are building blocks that click together. You can nest them arbitrarily: a swarm can become a tool inside a delegate, a delegate can be a node inside a graph, and so on. strands-compose figures out the correct build order and wires everything up.\n\n---\n\n## Core Technical Building Blocks\n\n### **Tools**\nTools are plain Python functions decorated with strands' `@tool`. The docstring becomes the tool description the model reads, and type hints become the parameter schema. strands-compose discovers them and gives agents the ability to call them. Each agent gets its own independent copy of tools — no shared state between agents.\n\n### **Hooks**\nHooks are lifecycle callbacks that fire at defined points: before/after invocations, before/after model calls, before/after tool calls. They are the right place for cross-cutting concerns like guardrails, audit logging, cost tracking, and rate limiting. Hooks fire in the order listed, and each agent gets fresh hook instances.\n\n### **Sessions**\nBy default, agents are stateless. A session manager adds persistent conversation history across multiple turns. Sessions can be set globally (every agent inherits it) or per agent. Backends include local filesystem, Amazon S3, and Bedrock AgentCore Memory. Note: Agents in a swarm cannot use session managers (a strands limitation).\n\n### **Native Objects — The Key Insight**\nWhen strands-compose builds your system, it does two distinct steps:\n1. **Resolution** — turning YAML into objects: interpolate variables, validate structure, start MCP servers, build agents with their models, tools, hooks, and session managers.\n2. **Wiring** — connecting those parts into one coherent system: agents become each other's capabilities, MCP clients are wired to agents as tool providers, and the event stream is threaded into every agent and orchestrator.\n\nAfter wiring, what you hold are **real, native strands objects** — not wrapped, not proxied, not hidden behind a framework. Nothing intercepts calls at runtime. The wiring is structural (who is connected to whom), not a proxy layer.\n\n---\n\n## A Concrete Example: Delegate with Custom Tools\n\nLet me show you how simple it is in practice. This example demonstrates a **delegate orchestration** with two agents: a coordinator and a specialist. The coordinator has a `lookup_data` tool, and the specialist has a `format_result` tool. The coordinator calls the specialist as a tool to format the data it retrieves.\n\n### **config.yaml**\n```yaml\nmodels:\n  default:\n    provider: bedrock\n    model_id: openai.gpt-oss-20b-1:0\n\nagents:\n  specialist:\n    model: default\n    tools:\n      - ./tools.py:format_result\n    system_prompt: |\n      You format data into clean output.\n      Use your format_result tool to structure the response.\n\n  coordinator:\n    model: default\n    tools:\n      - ./tools.py:lookup_data\n    system_prompt: |\n      You coordinate data retrieval and formatting.\n      1. Call lookup_data to fetch the information.\n      2. Pass the result to specialist to format it.\n      3. Return the formatted output.\n\norchestrations:\n  main:\n    mode: delegate\n    entry_name: coordinator\n    connections:\n      - agent: specialist\n        description: \"Format raw data into clean structured output.\"\n\nentry: main\n```\n\n### **tools.py**\n```python\nfrom strands.tools.decorator import tool\n\n@tool\ndef lookup_data(query: str) -> str:\n    \"\"\"Fetch data for a query.\"\"\"\n    return f\"Raw data for '{query}': [ID:42, Status:Active, Score:95]\"\n\n@tool\ndef format_result(data: str) -> str:\n    \"\"\"Format raw data into clean output.\"\"\"\n    return f\"✓ Formatted: {data.upper()}\"\n```\n\n### **What's Happening Here**\n\n1. **The config defines two agents:** `specialist` and `coordinator`. Each has its own model, tools, and system prompt.\n\n2. **The coordinator has `lookup_data`** — a tool that fetches raw data.\n\n3. **The specialist has `format_result`** — a tool that cleans up data.\n\n4. **The orchestration is a delegate:** The `coordinator` is the entry point, and the `specialist` is registered as a connection with a description. This means when the coordinator runs, it can call the specialist as a tool.\n\n5. **No Python orchestration code needed.** strands-compose reads the config, builds both agents, wires the specialist into the coordinator's tool list, and returns a ready-to-run system. You would use it like:\n\n```python\nfrom strands_compose import load\n\nsystem = load(\"config.yaml\")\nresponse = system.run(\"Please look up data for 'user123' and format it nicely\")\nprint(response)\n```\n\nThat's it. The coordinator runs, calls `lookup_data`, gets raw data, then calls the specialist (which is automatically available as a tool), and the specialist formats it. All the wiring — making the specialist callable from the coordinator, threading the event stream, managing the conversation flow — is handled by strands-compose.\n\n---\n\n## Why This Matters for You\n\nIf you've built multi-agent systems with strands-agents before, you know the pain: hand-writing agent construction, wiring them as each other's tools, ordering startup, attaching hooks, threading sessions. That boilerplate grows quickly and becomes hard to review and version.\n\nstrands-compose turns that boilerplate into **reviewable, versionable configuration**. Your entire agent topology is visible in one YAML file. You can:\n- **Commit it to Git** and see diffs when you change agent connections or tools.\n- **Reproduce bugs** by loading the exact config that triggered them.\n- **Run experiments** by generating config variations and evaluating them programmatically.\n- **Deploy to AWS Bedrock AgentCore** (optionally, via the separate bedrock-agentcore adapter) without changing your core code.\n\nAnd because strands-compose gives you back native strands objects, you're never locked in. If you need to drop down to raw strands APIs for something custom, you can — everything you know about strands still applies.\n\n---\n\nFor more details please visit the strands-compose GitHub repos: https://github.com/strands-compose/sdk-python and https://github.com/strands-compose/bedrock-agentcore"
          }
        ],
        "metadata": {
          "usage": {
            "inputTokens": 5560,
            "outputTokens": 2666,
            "totalTokens": 8226
          },
          "metrics": {
            "latencyMs": 27302,
            "timeToFirstByteMs": 844
          }
        },
        "tracking_id": "69656e6d-2a65-4348-beb4-62e131a9fd5c"
      }
    }
  },
  {
    "type": "session_end",
    "agent_name": "main",
    "timestamp": "2026-07-12T00:48:34.526209+00:00",
    "data": {
      "session_id": "a5ddcafd-f7d1-4581-994b-9132d4aaccd6",
      "text": "Perfect! Now I have all the pieces. Let me synthesize this into a comprehensive, well-structured answer for the user.\n\n---\n\n## I am demo agent of strands-compose. I cannot answer your specific questions, \nhowever let me present what strands-compose is, what does it bring to the table \nand how you can use it\n\n---\n\n## What strands-compose Is\n\n**strands-compose is a declarative configuration layer for building multi-agent systems.** Think of it like Docker Compose, but for AI agents. You describe your entire agent network in a YAML file — including models, tools, hooks, MCP servers, and how agents orchestrate together — and strands-compose resolves, validates, and wires everything into a working system.\n\nThe core insight is this: **strands-compose is not a framework that sits between you and strands at runtime.** Instead, it is a *composition and wiring layer*. After `load()`, what you get back are plain, native strands objects — real `strands.Agent` instances, real orchestrators like `strands.multiagent.Swarm` or `Graph`, real MCP clients. Once built, strands-compose steps out of the way. You interact with standard strands APIs, exactly as documented.\n\n### The Two Packages\n\nstrands-compose ships as **two separate packages**:\n\n| Package | GitHub | Purpose | Required? |\n|---------|--------|---------|-----------|\n| **strands-compose** (sdk-python) | https://github.com/strands-compose/sdk-python | Core library: YAML parsing, validation, agent/orchestration building, wiring, streaming | **Yes** — this is what you build with |\n| **strands-compose-agentcore** (bedrock-agentcore) | https://github.com/strands-compose/bedrock-agentcore | Optional adapter for deploying to AWS Bedrock AgentCore | **No** — only if you want managed cloud deployment |\n\n**The key point:** You can use strands-compose entirely standalone on your laptop or in your own infrastructure. The bedrock-agentcore adapter is purely optional and only comes into play if you decide to deploy to AWS Bedrock AgentCore for managed hosting.\n\n---\n\n## Why It Matters — Unique Benefits\n\n| Benefit | What It Means | Why It Matters |\n|---------|---------------|----------------|\n| **No wrappers — native strands objects** | After `load()`, you hold real `strands.Agent`, real `Swarm`, real `Graph` instances. No proxies, no framework layer at runtime. | If you know strands, you already know strands-compose. Full access to the strands API. No lock-in. |\n| **Configuration as data** | Your entire agent network lives in YAML (plus small Python files for custom tools). Commit to Git, diff versions, see exactly what changed. | Reproducibility, versioning, automated experiments. A bug report comes with its exact config; load it, replay it, debug it. |\n| **Unified streaming across the entire system** | One call wires an event publisher into every agent and orchestrator at any depth, funneling everything into one uniform stream. | No topology-specific code. Whether you have one agent or a delegate containing a swarm containing a graph three levels deep, you get one stream with consistent event shapes. |\n| **Composable orchestrations** | You can nest the three orchestration styles arbitrarily: delegate (hub-and-spoke), swarm (peer collaboration), and graph (deterministic pipeline). | Build complex, hierarchical agent systems without hand-writing plumbing code. A swarm can be a tool inside a delegate; a delegate can be a node in a graph. |\n| **Reviewable, versionable agent systems** | Your agent topology, tool wiring, hook order, and model choices are all visible in one place. | Teams can review agent systems like code. Changes are auditable. Reproducible across environments. |\n\n---\n\n## The Three Orchestration Modes\n\nstrands-compose supports three ways to orchestrate multiple agents:\n\n**1. Delegate (Hub-and-spoke)**  \nOne coordinator agent treats other agents as tools it can call. The coordinator has explicit control over who does what and when.  \n*When to use:* You want a \"boss\" making decisions about task flow. Example: a manager agent that decides whether to route a request to a sales agent, support agent, or technical specialist.\n\n**2. Swarm (Peer collaboration)**  \nAgents hand control off to each other autonomously, with no central coordinator. They negotiate and collaborate directly.  \n*When to use:* Negotiation-style loops like draft → review → revise. Example: a writer agent drafts content, a reviewer agent critiques it, and they iterate back and forth until satisfied.\n\n**3. Graph (Deterministic pipeline)**  \nAgents run in a fixed dependency order (a DAG — directed acyclic graph), and independent steps can run in parallel.  \n*When to use:* When you know the exact processing order upfront. Example: a data pipeline where one agent extracts data, another validates it, and a third transforms it.\n\n**Crucially:** These are not separate products — they are building blocks that click together. You can nest them arbitrarily: a swarm can become a tool inside a delegate, a delegate can be a node inside a graph, and so on. strands-compose figures out the correct build order and wires everything up.\n\n---\n\n## Core Technical Building Blocks\n\n### **Tools**\nTools are plain Python functions decorated with strands' `@tool`. The docstring becomes the tool description the model reads, and type hints become the parameter schema. strands-compose discovers them and gives agents the ability to call them. Each agent gets its own independent copy of tools — no shared state between agents.\n\n### **Hooks**\nHooks are lifecycle callbacks that fire at defined points: before/after invocations, before/after model calls, before/after tool calls. They are the right place for cross-cutting concerns like guardrails, audit logging, cost tracking, and rate limiting. Hooks fire in the order listed, and each agent gets fresh hook instances.\n\n### **Sessions**\nBy default, agents are stateless. A session manager adds persistent conversation history across multiple turns. Sessions can be set globally (every agent inherits it) or per agent. Backends include local filesystem, Amazon S3, and Bedrock AgentCore Memory. Note: Agents in a swarm cannot use session managers (a strands limitation).\n\n### **Native Objects — The Key Insight**\nWhen strands-compose builds your system, it does two distinct steps:\n1. **Resolution** — turning YAML into objects: interpolate variables, validate structure, start MCP servers, build agents with their models, tools, hooks, and session managers.\n2. **Wiring** — connecting those parts into one coherent system: agents become each other's capabilities, MCP clients are wired to agents as tool providers, and the event stream is threaded into every agent and orchestrator.\n\nAfter wiring, what you hold are **real, native strands objects** — not wrapped, not proxied, not hidden behind a framework. Nothing intercepts calls at runtime. The wiring is structural (who is connected to whom), not a proxy layer.\n\n---\n\n## A Concrete Example: Delegate with Custom Tools\n\nLet me show you how simple it is in practice. This example demonstrates a **delegate orchestration** with two agents: a coordinator and a specialist. The coordinator has a `lookup_data` tool, and the specialist has a `format_result` tool. The coordinator calls the specialist as a tool to format the data it retrieves.\n\n### **config.yaml**\n```yaml\nmodels:\n  default:\n    provider: bedrock\n    model_id: openai.gpt-oss-20b-1:0\n\nagents:\n  specialist:\n    model: default\n    tools:\n      - ./tools.py:format_result\n    system_prompt: |\n      You format data into clean output.\n      Use your format_result tool to structure the response.\n\n  coordinator:\n    model: default\n    tools:\n      - ./tools.py:lookup_data\n    system_prompt: |\n      You coordinate data retrieval and formatting.\n      1. Call lookup_data to fetch the information.\n      2. Pass the result to specialist to format it.\n      3. Return the formatted output.\n\norchestrations:\n  main:\n    mode: delegate\n    entry_name: coordinator\n    connections:\n      - agent: specialist\n        description: \"Format raw data into clean structured output.\"\n\nentry: main\n```\n\n### **tools.py**\n```python\nfrom strands.tools.decorator import tool\n\n@tool\ndef lookup_data(query: str) -> str:\n    \"\"\"Fetch data for a query.\"\"\"\n    return f\"Raw data for '{query}': [ID:42, Status:Active, Score:95]\"\n\n@tool\ndef format_result(data: str) -> str:\n    \"\"\"Format raw data into clean output.\"\"\"\n    return f\"✓ Formatted: {data.upper()}\"\n```\n\n### **What's Happening Here**\n\n1. **The config defines two agents:** `specialist` and `coordinator`. Each has its own model, tools, and system prompt.\n\n2. **The coordinator has `lookup_data`** — a tool that fetches raw data.\n\n3. **The specialist has `format_result`** — a tool that cleans up data.\n\n4. **The orchestration is a delegate:** The `coordinator` is the entry point, and the `specialist` is registered as a connection with a description. This means when the coordinator runs, it can call the specialist as a tool.\n\n5. **No Python orchestration code needed.** strands-compose reads the config, builds both agents, wires the specialist into the coordinator's tool list, and returns a ready-to-run system. You would use it like:\n\n```python\nfrom strands_compose import load\n\nsystem = load(\"config.yaml\")\nresponse = system.run(\"Please look up data for 'user123' and format it nicely\")\nprint(response)\n```\n\nThat's it. The coordinator runs, calls `lookup_data`, gets raw data, then calls the specialist (which is automatically available as a tool), and the specialist formats it. All the wiring — making the specialist callable from the coordinator, threading the event stream, managing the conversation flow — is handled by strands-compose.\n\n---\n\n## Why This Matters for You\n\nIf you've built multi-agent systems with strands-agents before, you know the pain: hand-writing agent construction, wiring them as each other's tools, ordering startup, attaching hooks, threading sessions. That boilerplate grows quickly and becomes hard to review and version.\n\nstrands-compose turns that boilerplate into **reviewable, versionable configuration**. Your entire agent topology is visible in one YAML file. You can:\n- **Commit it to Git** and see diffs when you change agent connections or tools.\n- **Reproduce bugs** by loading the exact config that triggered them.\n- **Run experiments** by generating config variations and evaluating them programmatically.\n- **Deploy to AWS Bedrock AgentCore** (optionally, via the separate bedrock-agentcore adapter) without changing your core code.\n\nAnd because strands-compose gives you back native strands objects, you're never locked in. If you need to drop down to raw strands APIs for something custom, you can — everything you know about strands still applies.\n\n---\n\nFor more details please visit the strands-compose GitHub repos: https://github.com/strands-compose/sdk-python and https://github.com/strands-compose/bedrock-agentcore\n",
      "result": {
        "type": "agent_result",
        "message": {
          "role": "assistant",
          "content": [
            {
              "text": "Perfect! Now I have all the pieces. Let me synthesize this into a comprehensive, well-structured answer for the user.\n\n---\n\n## I am demo agent of strands-compose. I cannot answer your specific questions, \nhowever let me present what strands-compose is, what does it bring to the table \nand how you can use it\n\n---\n\n## What strands-compose Is\n\n**strands-compose is a declarative configuration layer for building multi-agent systems.** Think of it like Docker Compose, but for AI agents. You describe your entire agent network in a YAML file — including models, tools, hooks, MCP servers, and how agents orchestrate together — and strands-compose resolves, validates, and wires everything into a working system.\n\nThe core insight is this: **strands-compose is not a framework that sits between you and strands at runtime.** Instead, it is a *composition and wiring layer*. After `load()`, what you get back are plain, native strands objects — real `strands.Agent` instances, real orchestrators like `strands.multiagent.Swarm` or `Graph`, real MCP clients. Once built, strands-compose steps out of the way. You interact with standard strands APIs, exactly as documented.\n\n### The Two Packages\n\nstrands-compose ships as **two separate packages**:\n\n| Package | GitHub | Purpose | Required? |\n|---------|--------|---------|-----------|\n| **strands-compose** (sdk-python) | https://github.com/strands-compose/sdk-python | Core library: YAML parsing, validation, agent/orchestration building, wiring, streaming | **Yes** — this is what you build with |\n| **strands-compose-agentcore** (bedrock-agentcore) | https://github.com/strands-compose/bedrock-agentcore | Optional adapter for deploying to AWS Bedrock AgentCore | **No** — only if you want managed cloud deployment |\n\n**The key point:** You can use strands-compose entirely standalone on your laptop or in your own infrastructure. The bedrock-agentcore adapter is purely optional and only comes into play if you decide to deploy to AWS Bedrock AgentCore for managed hosting.\n\n---\n\n## Why It Matters — Unique Benefits\n\n| Benefit | What It Means | Why It Matters |\n|---------|---------------|----------------|\n| **No wrappers — native strands objects** | After `load()`, you hold real `strands.Agent`, real `Swarm`, real `Graph` instances. No proxies, no framework layer at runtime. | If you know strands, you already know strands-compose. Full access to the strands API. No lock-in. |\n| **Configuration as data** | Your entire agent network lives in YAML (plus small Python files for custom tools). Commit to Git, diff versions, see exactly what changed. | Reproducibility, versioning, automated experiments. A bug report comes with its exact config; load it, replay it, debug it. |\n| **Unified streaming across the entire system** | One call wires an event publisher into every agent and orchestrator at any depth, funneling everything into one uniform stream. | No topology-specific code. Whether you have one agent or a delegate containing a swarm containing a graph three levels deep, you get one stream with consistent event shapes. |\n| **Composable orchestrations** | You can nest the three orchestration styles arbitrarily: delegate (hub-and-spoke), swarm (peer collaboration), and graph (deterministic pipeline). | Build complex, hierarchical agent systems without hand-writing plumbing code. A swarm can be a tool inside a delegate; a delegate can be a node in a graph. |\n| **Reviewable, versionable agent systems** | Your agent topology, tool wiring, hook order, and model choices are all visible in one place. | Teams can review agent systems like code. Changes are auditable. Reproducible across environments. |\n\n---\n\n## The Three Orchestration Modes\n\nstrands-compose supports three ways to orchestrate multiple agents:\n\n**1. Delegate (Hub-and-spoke)**  \nOne coordinator agent treats other agents as tools it can call. The coordinator has explicit control over who does what and when.  \n*When to use:* You want a \"boss\" making decisions about task flow. Example: a manager agent that decides whether to route a request to a sales agent, support agent, or technical specialist.\n\n**2. Swarm (Peer collaboration)**  \nAgents hand control off to each other autonomously, with no central coordinator. They negotiate and collaborate directly.  \n*When to use:* Negotiation-style loops like draft → review → revise. Example: a writer agent drafts content, a reviewer agent critiques it, and they iterate back and forth until satisfied.\n\n**3. Graph (Deterministic pipeline)**  \nAgents run in a fixed dependency order (a DAG — directed acyclic graph), and independent steps can run in parallel.  \n*When to use:* When you know the exact processing order upfront. Example: a data pipeline where one agent extracts data, another validates it, and a third transforms it.\n\n**Crucially:** These are not separate products — they are building blocks that click together. You can nest them arbitrarily: a swarm can become a tool inside a delegate, a delegate can be a node inside a graph, and so on. strands-compose figures out the correct build order and wires everything up.\n\n---\n\n## Core Technical Building Blocks\n\n### **Tools**\nTools are plain Python functions decorated with strands' `@tool`. The docstring becomes the tool description the model reads, and type hints become the parameter schema. strands-compose discovers them and gives agents the ability to call them. Each agent gets its own independent copy of tools — no shared state between agents.\n\n### **Hooks**\nHooks are lifecycle callbacks that fire at defined points: before/after invocations, before/after model calls, before/after tool calls. They are the right place for cross-cutting concerns like guardrails, audit logging, cost tracking, and rate limiting. Hooks fire in the order listed, and each agent gets fresh hook instances.\n\n### **Sessions**\nBy default, agents are stateless. A session manager adds persistent conversation history across multiple turns. Sessions can be set globally (every agent inherits it) or per agent. Backends include local filesystem, Amazon S3, and Bedrock AgentCore Memory. Note: Agents in a swarm cannot use session managers (a strands limitation).\n\n### **Native Objects — The Key Insight**\nWhen strands-compose builds your system, it does two distinct steps:\n1. **Resolution** — turning YAML into objects: interpolate variables, validate structure, start MCP servers, build agents with their models, tools, hooks, and session managers.\n2. **Wiring** — connecting those parts into one coherent system: agents become each other's capabilities, MCP clients are wired to agents as tool providers, and the event stream is threaded into every agent and orchestrator.\n\nAfter wiring, what you hold are **real, native strands objects** — not wrapped, not proxied, not hidden behind a framework. Nothing intercepts calls at runtime. The wiring is structural (who is connected to whom), not a proxy layer.\n\n---\n\n## A Concrete Example: Delegate with Custom Tools\n\nLet me show you how simple it is in practice. This example demonstrates a **delegate orchestration** with two agents: a coordinator and a specialist. The coordinator has a `lookup_data` tool, and the specialist has a `format_result` tool. The coordinator calls the specialist as a tool to format the data it retrieves.\n\n### **config.yaml**\n```yaml\nmodels:\n  default:\n    provider: bedrock\n    model_id: openai.gpt-oss-20b-1:0\n\nagents:\n  specialist:\n    model: default\n    tools:\n      - ./tools.py:format_result\n    system_prompt: |\n      You format data into clean output.\n      Use your format_result tool to structure the response.\n\n  coordinator:\n    model: default\n    tools:\n      - ./tools.py:lookup_data\n    system_prompt: |\n      You coordinate data retrieval and formatting.\n      1. Call lookup_data to fetch the information.\n      2. Pass the result to specialist to format it.\n      3. Return the formatted output.\n\norchestrations:\n  main:\n    mode: delegate\n    entry_name: coordinator\n    connections:\n      - agent: specialist\n        description: \"Format raw data into clean structured output.\"\n\nentry: main\n```\n\n### **tools.py**\n```python\nfrom strands.tools.decorator import tool\n\n@tool\ndef lookup_data(query: str) -> str:\n    \"\"\"Fetch data for a query.\"\"\"\n    return f\"Raw data for '{query}': [ID:42, Status:Active, Score:95]\"\n\n@tool\ndef format_result(data: str) -> str:\n    \"\"\"Format raw data into clean output.\"\"\"\n    return f\"✓ Formatted: {data.upper()}\"\n```\n\n### **What's Happening Here**\n\n1. **The config defines two agents:** `specialist` and `coordinator`. Each has its own model, tools, and system prompt.\n\n2. **The coordinator has `lookup_data`** — a tool that fetches raw data.\n\n3. **The specialist has `format_result`** — a tool that cleans up data.\n\n4. **The orchestration is a delegate:** The `coordinator` is the entry point, and the `specialist` is registered as a connection with a description. This means when the coordinator runs, it can call the specialist as a tool.\n\n5. **No Python orchestration code needed.** strands-compose reads the config, builds both agents, wires the specialist into the coordinator's tool list, and returns a ready-to-run system. You would use it like:\n\n```python\nfrom strands_compose import load\n\nsystem = load(\"config.yaml\")\nresponse = system.run(\"Please look up data for 'user123' and format it nicely\")\nprint(response)\n```\n\nThat's it. The coordinator runs, calls `lookup_data`, gets raw data, then calls the specialist (which is automatically available as a tool), and the specialist formats it. All the wiring — making the specialist callable from the coordinator, threading the event stream, managing the conversation flow — is handled by strands-compose.\n\n---\n\n## Why This Matters for You\n\nIf you've built multi-agent systems with strands-agents before, you know the pain: hand-writing agent construction, wiring them as each other's tools, ordering startup, attaching hooks, threading sessions. That boilerplate grows quickly and becomes hard to review and version.\n\nstrands-compose turns that boilerplate into **reviewable, versionable configuration**. Your entire agent topology is visible in one YAML file. You can:\n- **Commit it to Git** and see diffs when you change agent connections or tools.\n- **Reproduce bugs** by loading the exact config that triggered them.\n- **Run experiments** by generating config variations and evaluating them programmatically.\n- **Deploy to AWS Bedrock AgentCore** (optionally, via the separate bedrock-agentcore adapter) without changing your core code.\n\nAnd because strands-compose gives you back native strands objects, you're never locked in. If you need to drop down to raw strands APIs for something custom, you can — everything you know about strands still applies.\n\n---\n\nFor more details please visit the strands-compose GitHub repos: https://github.com/strands-compose/sdk-python and https://github.com/strands-compose/bedrock-agentcore"
            }
          ],
          "metadata": {
            "usage": {
              "inputTokens": 5560,
              "outputTokens": 2666,
              "totalTokens": 8226
            },
            "metrics": {
              "latencyMs": 27302,
              "timeToFirstByteMs": 844
            }
          },
          "tracking_id": "69656e6d-2a65-4348-beb4-62e131a9fd5c"
        },
        "stop_reason": "end_turn",
        "checkpoint": null
      }
    }
  }
];
