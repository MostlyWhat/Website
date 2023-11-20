<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @particles/menu.html.twig */
class __TwigTemplate_ed73260baa116777b4cf0e0469295c0996e0f39e4f4775244f9a53d32d60fdc3 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        try {            // line 2
            echo "    ";
            $context["menu"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "menu", []), "instance", [0 => ($context["particle"] ?? null)], "method");
        } catch (\Exception $e) {
            if ($context['gantry']->debug()) throw $e;
            if (\GANTRY_DEBUGGER) \Gantry\Debugger::addException($e);
            $context['e'] = $e;
            // line 4
            echo "    <div class=\"alert alert-error\">";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["e"] ?? null), "getMessage", []), "html", null, true);
            echo "</div>
";
        }
        // line 6
        echo "
";
        // line 14
        echo "
";
        // line 32
        echo "
";
        // line 41
        echo "
";
        // line 134
        echo "
";
        // line 151
        echo "
";
        // line 160
        echo "
";
        // line 175
        echo "
";
        // line 176
        $context["macro"] = $this;
        // line 177
        echo "
";
        // line 178
        if ($this->getAttribute($this->getAttribute(($context["menu"] ?? null), "root", []), "count", [], "method")) {
            // line 179
            echo "    <nav class=\"g-main-nav\"";
            echo (($this->getAttribute(($context["particle"] ?? null), "mobileTarget", [])) ? (" data-g-mobile-target") : (""));
            echo " data-g-hover-expand=\"";
            echo (((($this->getAttribute(($context["particle"] ?? null), "hoverExpand", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["particle"] ?? null), "hoverExpand", []), "true")) : ("true"))) ? ("true") : ("false"));
            echo "\">
        <ul class=\"g-toplevel\">
            ";
            // line 181
            echo $context["macro"]->getdisplayItems($this->getAttribute(($context["menu"] ?? null), "root", []), ($context["menu"] ?? null), $context);
            echo "
        </ul>
    </nav>
";
        }
    }

    // line 7
    public function getgetCustomWidth($__item__ = null, $__menu__ = null, $__mode__ = null, $__dropdown_type__ = null, $__start_level__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "item" => $__item__,
            "menu" => $__menu__,
            "mode" => $__mode__,
            "dropdown_type" => $__dropdown_type__,
            "start_level" => $__start_level__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start();
        try {
            // line 8
            if ((((($this->getAttribute(($context["item"] ?? null), "width", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["item"] ?? null), "width", []), "auto")) : ("auto")) != "auto") &&  !((($context["dropdown_type"] ?? null) == "fullwidth") && ($this->getAttribute(($context["item"] ?? null), "level", []) > ($context["start_level"] ?? null))))) {
                // line 9
                if ((($context["mode"] ?? null) == "item")) {
                    echo " style=\"position: relative;\"";
                } elseif ((                // line 10
($context["mode"] ?? null) == "submenu")) {
                    echo " style=\"width:";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "width", []), "html", null, true);
                    echo ";\" data-g-item-width=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "width", []), "html", null, true);
                    echo "\"";
                }
            }
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    // line 15
    public function getdisplayParticle($__item__ = null, $__context__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "item" => $__item__,
            "context" => $__context__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start();
        try {
            // line 16
            echo "    ";
            try {                // line 17
                echo "    ";
                $context["in_particle"] = (((($this->getAttribute(($context["context"] ?? null), "in_particle", [], "any", true, true) &&  !(null === $this->getAttribute(($context["context"] ?? null), "in_particle", [])))) ? ($this->getAttribute(($context["context"] ?? null), "in_particle", [])) : (0)) + 1);
                // line 18
                echo "    ";
                if ((($context["in_particle"] ?? null) > 5)) {
                    // line 19
                    echo "        ";
                    throw new \RuntimeException("Particle loop detected"                    ,                     500                    );
                    // line 20
                    echo "    ";
                }
                // line 21
                echo "
    ";
                // line 22
                $context["context"] = twig_array_merge(($context["context"] ?? null), ["particle" => $this->getAttribute($this->getAttribute(($context["item"] ?? null), "options", []), "particle", []), "in_particle" => ($context["in_particle"] ?? null)]);
                // line 23
                echo "    ";
                $context["classes"] = $this->getAttribute($this->getAttribute($this->getAttribute(($context["item"] ?? null), "options", []), "block", []), "class", []);
                // line 24
                echo "    <div class=\"menu-item-particle";
                ((($context["classes"] ?? null)) ? (print (twig_escape_filter($this->env, (" " . ($context["classes"] ?? null)), "html", null, true))) : (print ("")));
                echo "\">
        ";
                // line 25
                $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = null;
                try {
                    $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 =                     $this->loadTemplate([0 => (("particles/" . $this->getAttribute(($context["item"] ?? null), "particle", [])) . ".html.twig"), 1 => (("@particles/" . $this->getAttribute(($context["item"] ?? null), "particle", [])) . ".html.twig")], "@particles/menu.html.twig", 25);
                } catch (LoaderError $e) {
                    // ignore missing template
                }
                if ($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4) {
                    $__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4->display(twig_to_array(                    // line 26
($context["context"] ?? null)));
                }
                // line 27
                echo "    </div>
    ";
            } catch (\Exception $e) {
                if ($context['gantry']->debug()) throw $e;
                if (\GANTRY_DEBUGGER) \Gantry\Debugger::addException($e);
                $context['e'] = $e;
                // line 29
                echo "        <div class=\"alert alert-error\">";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["e"] ?? null), "getMessage", []), "html", null, true);
                echo "</div>
    ";
            }
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    // line 33
    public function getdisplayTitle($__item__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "item" => $__item__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start();
        try {
            // line 34
            echo "    ";
            if (( !$this->getAttribute(($context["item"] ?? null), "icon_only", []) ||  !($this->getAttribute(($context["item"] ?? null), "image", []) || $this->getAttribute(($context["item"] ?? null), "icon", [])))) {
                // line 35
                echo "        <span class=\"g-menu-item-title\">";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "title", []), "html", null, true);
                echo "</span>
        ";
                // line 36
                if ($this->getAttribute(($context["item"] ?? null), "subtitle", [])) {
                    // line 37
                    echo "            <span class=\"g-menu-item-subtitle\">";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "subtitle", []), "html", null, true);
                    echo "</span>
        ";
                }
                // line 39
                echo "    ";
            }
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    // line 42
    public function getdisplayItem($__item__ = null, $__menu__ = null, $__context__ = null, $__dropdown_type__ = null, $__start_level__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "item" => $__item__,
            "menu" => $__menu__,
            "context" => $__context__,
            "dropdown_type" => $__dropdown_type__,
            "start_level" => $__start_level__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start();
        try {
            // line 43
            echo "    ";
            $context["self"] = $this;
            // line 44
            echo "    ";
            if ((($this->getAttribute(($context["item"] ?? null), "type", []) == "particle") &&  !$this->getAttribute($this->getAttribute($this->getAttribute(($context["item"] ?? null), "options", []), "particle", []), "enabled", []))) {
                // line 45
                echo "        ";
                $context["enabled"] = 0;
                // line 46
                echo "    ";
            }
            // line 47
            echo "    ";
            if ((($this->getAttribute(($context["item"] ?? null), "visible", []) && $this->getAttribute(($context["item"] ?? null), "enabled", [])) && ((array_key_exists("enabled", $context)) ? (_twig_default_filter(($context["enabled"] ?? null), 1)) : (1)))) {
                // line 48
                echo "        ";
                $context["title"] = ((($this->getAttribute(($context["item"] ?? null), "icon_only", []) || $this->getAttribute(($context["item"] ?? null), "link_title", []))) ? (((" title=\"" . twig_escape_filter($this->env, (($this->getAttribute(($context["item"] ?? null), "link_title", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["item"] ?? null), "link_title", []), $this->getAttribute(($context["item"] ?? null), "title", []))) : ($this->getAttribute(($context["item"] ?? null), "title", []))))) . "\"")) : (""));
                // line 49
                echo "        ";
                $context["label"] = ((($this->getAttribute(($context["item"] ?? null), "icon_only", []) && ($this->getAttribute(($context["item"] ?? null), "image", []) || $this->getAttribute(($context["item"] ?? null), "icon", [])))) ? (((" aria-label=\"" . twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "title", []))) . "\"")) : (""));
                // line 50
                echo "        ";
                $context["active"] = (($this->getAttribute(($context["menu"] ?? null), "isActive", [0 => ($context["item"] ?? null)], "method")) ? (" active") : (""));
                // line 51
                echo "        ";
                $context["dropdown"] = ((($this->getAttribute(($context["item"] ?? null), "level", []) == ($context["start_level"] ?? null))) ? ((" g-" . $this->getAttribute(($context["item"] ?? null), "getDropdown", [], "method"))) : (""));
                // line 52
                echo "        ";
                $context["parent"] = ((($this->getAttribute(($context["item"] ?? null), "hasChildren", [], "method") &&  !$this->getAttribute(($context["item"] ?? null), "dropdown_hide", []))) ? (" g-parent") : (""));
                // line 53
                echo "        ";
                $context["target"] = (((($this->getAttribute(($context["item"] ?? null), "target", []) != "_self") || $this->getAttribute($this->getAttribute(($context["context"] ?? null), "particle", []), "forceTarget", []))) ? (((" target=\"" . twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "target", []))) . "\"")) : (""));
                // line 54
                echo "        ";
                $context["rel"] = $this->getAttribute(($context["item"] ?? null), "rel", []);
                // line 55
                echo "
        ";
                // line 56
                if (($this->getAttribute(($context["item"] ?? null), "target", []) == "_blank")) {
                    // line 57
                    echo "            ";
                    if (!twig_in_filter("noopener", ($context["rel"] ?? null))) {
                        // line 58
                        echo "                ";
                        $context["rel"] = ((($context["rel"] ?? null)) ? ((($context["rel"] ?? null) . " ")) : (($context["rel"] ?? null)));
                        // line 59
                        echo "                ";
                        $context["rel"] = (($context["rel"] ?? null) . "noopener");
                        // line 60
                        echo "            ";
                    }
                    // line 61
                    echo "            ";
                    if (!twig_in_filter("noreferrer", ($context["rel"] ?? null))) {
                        // line 62
                        echo "                ";
                        $context["rel"] = ((($context["rel"] ?? null)) ? ((($context["rel"] ?? null) . " ")) : (($context["rel"] ?? null)));
                        // line 63
                        echo "                ";
                        $context["rel"] = (($context["rel"] ?? null) . "noreferrer");
                        // line 64
                        echo "            ";
                    }
                    // line 65
                    echo "        ";
                }
                // line 66
                echo "
        ";
                // line 67
                $context["listAttributes"] = $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->attributeArrayFilter($this->getAttribute(($context["item"] ?? null), "attributes", []));
                // line 68
                echo "        ";
                $context["linkAttributes"] = "";
                // line 69
                echo "
        ";
                // line 70
                if ($this->getAttribute(($context["item"] ?? null), "link_attributes", [])) {
                    // line 71
                    echo "            ";
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["item"] ?? null), "link_attributes", []));
                    foreach ($context['_seq'] as $context["_key"] => $context["attribute"]) {
                        // line 72
                        echo "                ";
                        $context['_parent'] = $context;
                        $context['_seq'] = twig_ensure_traversable($context["attribute"]);
                        foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                            // line 73
                            echo "                    ";
                            if (($context["key"] == "rel")) {
                                // line 74
                                echo "                        ";
                                $context['_parent'] = $context;
                                $context['_seq'] = twig_ensure_traversable(twig_split_filter($this->env, $context["value"], " "));
                                foreach ($context['_seq'] as $context["_key"] => $context["hVal"]) {
                                    // line 75
                                    echo "                            ";
                                    if (!twig_in_filter($context["hVal"], ($context["rel"] ?? null))) {
                                        // line 76
                                        echo "                                ";
                                        $context["rel"] = ((($context["rel"] ?? null)) ? ((($context["rel"] ?? null) . " ")) : (($context["rel"] ?? null)));
                                        // line 77
                                        echo "                                ";
                                        $context["rel"] = (($context["rel"] ?? null) . $context["hVal"]);
                                        // line 78
                                        echo "                            ";
                                    }
                                    // line 79
                                    echo "                        ";
                                }
                                $_parent = $context['_parent'];
                                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['hVal'], $context['_parent'], $context['loop']);
                                $context = array_intersect_key($context, $_parent) + $_parent;
                                // line 80
                                echo "                    ";
                            } else {
                                // line 81
                                echo "                        ";
                                $context["linkAttributes"] = (((((($context["linkAttributes"] ?? null) . " ") . twig_escape_filter($this->env, $context["key"])) . "=\"") . twig_escape_filter($this->env, $context["value"], "html_attr")) . "\"");
                                // line 82
                                echo "                    ";
                            }
                            // line 83
                            echo "                ";
                        }
                        $_parent = $context['_parent'];
                        unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
                        $context = array_intersect_key($context, $_parent) + $_parent;
                        // line 84
                        echo "            ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['attribute'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 85
                    echo "        ";
                }
                // line 86
                echo "
        ";
                // line 88
                echo "        ";
                if (($this->getAttribute(($context["item"] ?? null), "target", []) == "_nonav")) {
                    // line 89
                    echo "            ";
                    $context["target"] = "target=\"_blank\"";
                    // line 90
                    echo "            ";
                    $context["linkAttributes"] = (($context["linkAttributes"] ?? null) . " onclick=\"window.open(this.href, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes'); return false;\"");
                    // line 91
                    echo "        ";
                }
                // line 92
                echo "
        ";
                // line 93
                $context["rel"] = ((($context["rel"] ?? null)) ? (((" rel=\"" . twig_escape_filter($this->env, ($context["rel"] ?? null), "html_attr")) . "\"")) : (""));
                // line 94
                echo "
        <li class=\"g-menu-item g-menu-item-type-";
                // line 95
                echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "type", []), "html", null, true);
                echo " g-menu-item-";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "id", []), "html", null, true);
                if ( !$this->getAttribute(($context["item"] ?? null), "dropdown_hide", [])) {
                    echo twig_escape_filter($this->env, ($context["parent"] ?? null), "html", null, true);
                }
                echo twig_escape_filter($this->env, ($context["active"] ?? null), "html", null, true);
                echo twig_escape_filter($this->env, ($context["dropdown"] ?? null), "html", null, true);
                echo " ";
                if (($this->getAttribute(($context["item"] ?? null), "url", []) && ($context["parent"] ?? null))) {
                    if ( !$this->getAttribute(($context["item"] ?? null), "dropdown_hide", [])) {
                        echo "g-menu-item-link-parent";
                    }
                }
                echo " ";
                echo twig_escape_filter($this->env, (($this->getAttribute(($context["item"] ?? null), "class", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["item"] ?? null), "class", []), "")) : ("")), "html", null, true);
                echo "\"";
                // line 96
                echo $context["self"]->getgetCustomWidth(($context["item"] ?? null), ($context["menu"] ?? null), "item", ($context["dropdown"] ?? null));
                // line 97
                if ((($this->getAttribute($this->getAttribute(($context["context"] ?? null), "particle", [], "any", false, true), "renderTitles", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute(($context["context"] ?? null), "particle", [], "any", false, true), "renderTitles", []), 0)) : (0))) {
                    echo " title=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "title", []), "html", null, true);
                    echo "\"";
                }
                echo ($context["listAttributes"] ?? null);
                echo ">
            ";
                // line 98
                if ($this->getAttribute(($context["item"] ?? null), "url", [])) {
                    // line 99
                    echo "                <a class=\"g-menu-item-container";
                    (($this->getAttribute(($context["item"] ?? null), "anchor_class", [])) ? (print (twig_escape_filter($this->env, (" " . $this->getAttribute(($context["item"] ?? null), "anchor_class", [])), "html", null, true))) : (print ("")));
                    echo "\" href=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "url", []), "html", null, true);
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "hash", []), "html", null, true);
                    echo "\"";
                    echo ((((($context["title"] ?? null) . ($context["label"] ?? null)) . ($context["target"] ?? null)) . ($context["rel"] ?? null)) . ($context["linkAttributes"] ?? null));
                    echo ">
            ";
                } else {
                    // line 101
                    echo "                <div class=\"g-menu-item-container";
                    (($this->getAttribute(($context["item"] ?? null), "anchor_class", [])) ? (print (twig_escape_filter($this->env, (" " . $this->getAttribute(($context["item"] ?? null), "anchor_class", [])), "html", null, true))) : (print ("")));
                    echo "\" data-g-menuparent=\"\"";
                    echo ($context["label"] ?? null);
                    echo ">";
                }
                // line 102
                echo "                ";
                if ($this->getAttribute(($context["item"] ?? null), "image", [])) {
                    // line 103
                    echo "                    <img src=\"";
                    echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute(($context["item"] ?? null), "image", [])), "html", null, true);
                    echo "\" alt=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "title", []), "html", null, true);
                    echo "\" />
                ";
                } elseif ($this->getAttribute(                // line 104
($context["item"] ?? null), "icon", [])) {
                    // line 105
                    echo "                    <i class=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "icon", []), "html", null, true);
                    echo "\" aria-hidden=\"true\"></i>
                ";
                }
                // line 107
                echo "                ";
                if ($this->getAttribute(($context["item"] ?? null), "url", [])) {
                    // line 108
                    echo "                    <span class=\"g-menu-item-content\">
                        ";
                    // line 109
                    echo $context["self"]->getdisplayTitle(($context["item"] ?? null));
                    echo "
                    </span>
                    ";
                    // line 111
                    if ((($context["parent"] ?? null) &&  !$this->getAttribute(($context["item"] ?? null), "dropdown_hide", []))) {
                        // line 112
                        echo "<span class=\"g-menu-parent-indicator\" data-g-menuparent=\"\"></span>";
                    }
                    // line 114
                    echo "                ";
                } else {
                    // line 115
                    echo "                    ";
                    if (($this->getAttribute(($context["item"] ?? null), "type", []) == "particle")) {
                        // line 116
                        echo "                        ";
                        echo $context["self"]->getdisplayParticle(($context["item"] ?? null), ($context["context"] ?? null));
                        echo "
                    ";
                    } elseif (($this->getAttribute(                    // line 117
($context["item"] ?? null), "type", []) == "heading")) {
                        // line 118
                        echo "                        <span class=\"g-nav-header g-menu-item-content\"";
                        echo ($context["title"] ?? null);
                        echo ">";
                        echo $context["self"]->getdisplayTitle(($context["item"] ?? null));
                        echo "</span>
                    ";
                    } else {
                        // line 120
                        echo "                        <span class=\"g-separator g-menu-item-content\"";
                        echo ($context["title"] ?? null);
                        echo ">";
                        echo $context["self"]->getdisplayTitle(($context["item"] ?? null));
                        echo "</span>
                    ";
                    }
                    // line 122
                    echo "                    ";
                    if ((($context["parent"] ?? null) &&  !$this->getAttribute(($context["item"] ?? null), "dropdown_hide", []))) {
                        // line 123
                        echo "<span class=\"g-menu-parent-indicator\"></span>";
                    }
                    // line 125
                    echo "                ";
                }
                // line 126
                echo "            ";
                if ($this->getAttribute(($context["item"] ?? null), "url", [])) {
                    echo "</a>
            ";
                } else {
                    // line 127
                    echo "</div>";
                }
                // line 128
                echo "            ";
                if (($context["parent"] ?? null)) {
                    // line 129
                    echo $context["self"]->getdisplaySubmenu(($context["item"] ?? null), ($context["menu"] ?? null), ($context["context"] ?? null), ($context["dropdown_type"] ?? null), ($context["start_level"] ?? null));
                }
                // line 131
                echo "        </li>
    ";
            }
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    // line 135
    public function getdisplayContainers($__item__ = null, $__menu__ = null, $__context__ = null, $__dropdown_type__ = null, $__start_level__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "item" => $__item__,
            "menu" => $__menu__,
            "context" => $__context__,
            "dropdown_type" => $__dropdown_type__,
            "start_level" => $__start_level__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start();
        try {
            // line 136
            echo "    ";
            $context["self"] = $this;
            // line 137
            echo "    <div class=\"g-grid\">
        ";
            // line 138
            $context["groups"] = ((($this->getAttribute(($context["item"] ?? null), "getDropdown", [], "method") == "standard")) ? ([0 => ($context["item"] ?? null)]) : ($this->getAttribute(($context["item"] ?? null), "groups", [])));
            // line 139
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["groups"] ?? null));
            foreach ($context['_seq'] as $context["column"] => $context["items"]) {
                // line 140
                echo "        <div class=\"g-block ";
                echo twig_escape_filter($this->env, call_user_func_array($this->env->getFilter('toGrid')->getCallable(), [$this->getAttribute(($context["item"] ?? null), "columnWidth", [0 => $context["column"]], "method")]), "html", null, true);
                echo "\">
            <ul class=\"g-sublevel\">
                <li class=\"g-level-";
                // line 142
                echo twig_escape_filter($this->env, (($this->getAttribute(($context["item"] ?? null), "level", []) - ($context["start_level"] ?? null)) + 1), "html", null, true);
                echo " g-go-back\">
                    <a class=\"g-menu-item-container\" href=\"#\" data-g-menuparent=\"\"><span>Back</span></a>
                </li>
                ";
                // line 145
                echo $context["self"]->getdisplayItems($context["items"], ($context["menu"] ?? null), ($context["context"] ?? null), ($context["dropdown_type"] ?? null), ($context["start_level"] ?? null));
                echo "
            </ul>
        </div>
        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['column'], $context['items'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 149
            echo "    </div>
";
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    // line 152
    public function getdisplayItems($__items__ = null, $__menu__ = null, $__context__ = null, $__dropdown_type__ = null, $__start_level__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "items" => $__items__,
            "menu" => $__menu__,
            "context" => $__context__,
            "dropdown_type" => $__dropdown_type__,
            "start_level" => $__start_level__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start();
        try {
            // line 153
            echo "    ";
            $context["self"] = $this;
            // line 154
            echo "    ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["items"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["item"]) {
                // line 155
                echo "        ";
                $context["start_level"] = (($context["start_level"]) ?? ((($context["root_level"]) ?? ($this->getAttribute($context["item"], "level", [])))));
                // line 156
                echo "        ";
                $context["dropdown"] = (($context["dropdown_type"]) ?? ($this->getAttribute($context["item"], "dropdown", [])));
                // line 157
                echo "        ";
                echo $context["self"]->getdisplayItem($context["item"], ($context["menu"] ?? null), ($context["context"] ?? null), ($context["dropdown"] ?? null), ($context["start_level"] ?? null));
                echo "
    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['item'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    // line 161
    public function getdisplaySubmenu($__item__ = null, $__menu__ = null, $__context__ = null, $__dropdown_type__ = null, $__start_level__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "item" => $__item__,
            "menu" => $__menu__,
            "context" => $__context__,
            "dropdown_type" => $__dropdown_type__,
            "start_level" => $__start_level__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start();
        try {
            // line 162
            echo "    ";
            $context["self"] = $this;
            // line 163
            echo "    ";
            if ( !$this->getAttribute(($context["item"] ?? null), "dropdown_hide", [])) {
                // line 164
                echo "        ";
                $context["animation"] = (($this->getAttribute($this->getAttribute($this->getAttribute(($context["context"] ?? null), "gantry", [], "any", false, true), "config", [], "any", false, true), "get", [0 => "styles.menu.animation"], "method", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute($this->getAttribute(($context["context"] ?? null), "gantry", [], "any", false, true), "config", [], "any", false, true), "get", [0 => "styles.menu.animation"], "method"), "g-fade")) : ("g-fade"));
                // line 165
                echo "        ";
                if (((((twig_length_filter($this->env, $this->getAttribute(($context["item"] ?? null), "groups", [])) == 1) && ( !($context["dropdown_type"] ?? null) == "fullwidth")) || (($context["dropdown_type"] ?? null) == "standard")) || (((($this->getAttribute(($context["item"] ?? null), "width", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["item"] ?? null), "width", []), "auto")) : ("auto")) != "auto") && (($context["dropdown_type"] ?? null) == "fullwidth")))) {
                    // line 166
                    echo "            ";
                    $context["dropdown_dir"] = ("g-dropdown-" . (($this->getAttribute(($context["item"] ?? null), "dropdown_dir", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["item"] ?? null), "dropdown_dir", []), "right")) : ("right")));
                    // line 167
                    echo "        ";
                }
                // line 168
                echo "        <ul class=\"g-dropdown g-inactive ";
                echo twig_escape_filter($this->env, ($context["animation"] ?? null), "html", null, true);
                echo " ";
                echo twig_escape_filter($this->env, ($context["dropdown_dir"] ?? null), "html", null, true);
                echo "\"";
                echo $context["self"]->getgetCustomWidth(($context["item"] ?? null), ($context["menu"] ?? null), "submenu", ($context["dropdown_type"] ?? null), ($context["start_level"] ?? null));
                echo ">
            <li class=\"g-dropdown-column\">
                ";
                // line 170
                echo $context["self"]->getdisplayContainers(($context["item"] ?? null), ($context["menu"] ?? null), ($context["context"] ?? null), ($context["dropdown_type"] ?? null), ($context["start_level"] ?? null));
                echo "
            </li>
        </ul>
    ";
            }
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    public function getTemplateName()
    {
        return "@particles/menu.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  752 => 170,  742 => 168,  739 => 167,  736 => 166,  733 => 165,  730 => 164,  727 => 163,  724 => 162,  708 => 161,  686 => 157,  683 => 156,  680 => 155,  675 => 154,  672 => 153,  656 => 152,  640 => 149,  630 => 145,  624 => 142,  618 => 140,  613 => 139,  611 => 138,  608 => 137,  605 => 136,  589 => 135,  572 => 131,  569 => 129,  566 => 128,  563 => 127,  557 => 126,  554 => 125,  551 => 123,  548 => 122,  540 => 120,  532 => 118,  530 => 117,  525 => 116,  522 => 115,  519 => 114,  516 => 112,  514 => 111,  509 => 109,  506 => 108,  503 => 107,  497 => 105,  495 => 104,  488 => 103,  485 => 102,  478 => 101,  467 => 99,  465 => 98,  456 => 97,  454 => 96,  436 => 95,  433 => 94,  431 => 93,  428 => 92,  425 => 91,  422 => 90,  419 => 89,  416 => 88,  413 => 86,  410 => 85,  404 => 84,  398 => 83,  395 => 82,  392 => 81,  389 => 80,  383 => 79,  380 => 78,  377 => 77,  374 => 76,  371 => 75,  366 => 74,  363 => 73,  358 => 72,  353 => 71,  351 => 70,  348 => 69,  345 => 68,  343 => 67,  340 => 66,  337 => 65,  334 => 64,  331 => 63,  328 => 62,  325 => 61,  322 => 60,  319 => 59,  316 => 58,  313 => 57,  311 => 56,  308 => 55,  305 => 54,  302 => 53,  299 => 52,  296 => 51,  293 => 50,  290 => 49,  287 => 48,  284 => 47,  281 => 46,  278 => 45,  275 => 44,  272 => 43,  256 => 42,  240 => 39,  234 => 37,  232 => 36,  227 => 35,  224 => 34,  212 => 33,  193 => 29,  186 => 27,  183 => 26,  175 => 25,  170 => 24,  167 => 23,  165 => 22,  162 => 21,  159 => 20,  156 => 19,  153 => 18,  150 => 17,  148 => 16,  135 => 15,  113 => 10,  110 => 9,  108 => 8,  92 => 7,  83 => 181,  75 => 179,  73 => 178,  70 => 177,  68 => 176,  65 => 175,  62 => 160,  59 => 151,  56 => 134,  53 => 41,  50 => 32,  47 => 14,  44 => 6,  38 => 4,  31 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% try %}
    {% set menu = gantry.menu.instance(particle) %}
{% catch %}
    <div class=\"alert alert-error\">{{ e.getMessage }}</div>
{% endtry %}

{% macro getCustomWidth(item, menu, mode, dropdown_type, start_level) -%}
    {%- if (item.width|default('auto') != 'auto') and not (dropdown_type == 'fullwidth' and item.level > start_level) -%}
        {%- if mode == 'item' %} style=\"position: relative;\"
        {%- elseif mode == 'submenu' %} style=\"width:{{ item.width }};\" data-g-item-width=\"{{ item.width }}\"
        {%- endif %}
    {%- endif %}
{%- endmacro %}

{% macro displayParticle(item, context) %}
    {% try %}
    {% set in_particle = (context.in_particle ?? 0) + 1 %}
    {% if in_particle > 5 %}
        {% throw 500 'Particle loop detected' %}
    {% endif %}

    {% set context = context|merge({ particle: item.options.particle, in_particle: in_particle}) %}
    {% set classes = item.options.block.class %}
    <div class=\"menu-item-particle{{ classes ? ' ' ~ classes }}\">
        {% include ['particles/' ~ item.particle ~ '.html.twig', '@particles/' ~ item.particle ~ '.html.twig']
        ignore missing with context only %}
    </div>
    {% catch %}
        <div class=\"alert alert-error\">{{ e.getMessage }}</div>
    {% endtry %}
{% endmacro %}

{% macro displayTitle(item) %}
    {% if not item.icon_only or not (item.image or item.icon) %}
        <span class=\"g-menu-item-title\">{{ item.title }}</span>
        {% if item.subtitle %}
            <span class=\"g-menu-item-subtitle\">{{ item.subtitle }}</span>
        {% endif %}
    {% endif %}
{% endmacro %}

{% macro displayItem(item, menu, context, dropdown_type, start_level) %}
    {% import _self as self %}
    {% if item.type == 'particle' and not item.options.particle.enabled %}
        {% set enabled = 0 %}
    {% endif %}
    {% if item.visible and item.enabled and enabled|default(1) %}
        {% set title = item.icon_only or item.link_title ? ' title=\"' ~ item.link_title|default(item.title)|e ~ '\"' %}
        {% set label = item.icon_only and (item.image or item.icon) ? ' aria-label=\"' ~ item.title|e ~'\"' %}
        {% set active = menu.isActive(item) ? ' active' %}
        {% set dropdown = item.level == start_level ? ' g-' ~ item.getDropdown() %}
        {% set parent = item.hasChildren() and not item.dropdown_hide ? ' g-parent' %}
        {% set target = (item.target != '_self' or context.particle.forceTarget) ? ' target=\"' ~ item.target|e ~ '\"' %}
        {% set rel = item.rel %}

        {% if item.target == '_blank' %}
            {% if 'noopener' not in rel %}
                {% set rel = rel ? rel ~ ' ' : rel %}
                {% set rel = rel ~ 'noopener' %}
            {% endif %}
            {% if 'noreferrer' not in rel %}
                {% set rel = rel ? rel ~ ' ' : rel %}
                {% set rel = rel ~ 'noreferrer' %}
            {% endif %}
        {% endif %}

        {% set listAttributes = item.attributes|attribute_array %}
        {% set linkAttributes = '' %}

        {% if item.link_attributes %}
            {% for attribute in item.link_attributes %}
                {% for key, value in attribute %}
                    {% if key == 'rel' %}
                        {% for hVal in value|split(' ') %}
                            {% if hVal not in rel %}
                                {% set rel = rel ? rel ~ ' ' : rel %}
                                {% set rel = rel ~ hVal %}
                            {% endif %}
                        {% endfor %}
                    {% else %}
                        {% set linkAttributes = linkAttributes ~ ' ' ~ key|e ~ '=\"' ~ value|e('html_attr') ~ '\"' %}
                    {% endif %}
                {% endfor %}
            {% endfor %}
        {% endif %}

        {# Special handling for opening link in a new window without navigation #}
        {% if item.target == '_nonav' %}
            {% set target = 'target=\"_blank\"' %}
            {% set linkAttributes = linkAttributes ~ ' onclick=\"window.open(this.href, \\'targetWindow\\', \\'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes\\'); return false;\"' %}
        {% endif %}

        {% set rel = rel ? ' rel=\"' ~ rel|e('html_attr') ~ '\"' %}

        <li class=\"g-menu-item g-menu-item-type-{{ item.type }} g-menu-item-{{ item.id }}{% if not item.dropdown_hide %}{{ parent }}{% endif %}{{ active }}{{ dropdown }} {% if item.url and parent %}{% if not item.dropdown_hide %}g-menu-item-link-parent{% endif %}{% endif %} {{ item.class|default('') }}\"
                {{- self.getCustomWidth(item, menu, 'item', dropdown) }}
                {%- if context.particle.renderTitles|default(0) %} title=\"{{ item.title }}\"{% endif %}{{listAttributes|raw}}>
            {% if item.url %}
                <a class=\"g-menu-item-container{{ item.anchor_class ? ' ' ~ item.anchor_class }}\" href=\"{{ item.url }}{{ item.hash }}\"{{ (title ~ label ~ target ~ rel ~ linkAttributes)|raw }}>
            {% else %}
                <div class=\"g-menu-item-container{{ item.anchor_class ? ' ' ~ item.anchor_class }}\" data-g-menuparent=\"\"{{ label|raw }}>{% endif %}
                {% if item.image %}
                    <img src=\"{{ url(item.image) }}\" alt=\"{{ item.title }}\" />
                {% elseif item.icon %}
                    <i class=\"{{ item.icon }}\" aria-hidden=\"true\"></i>
                {% endif %}
                {% if item.url %}
                    <span class=\"g-menu-item-content\">
                        {{ self.displayTitle(item) }}
                    </span>
                    {% if parent and not item.dropdown_hide -%}
                        <span class=\"g-menu-parent-indicator\" data-g-menuparent=\"\"></span>
                    {%- endif %}
                {% else %}
                    {% if item.type == 'particle' %}
                        {{ self.displayParticle(item, context) }}
                    {% elseif item.type == 'heading' %}
                        <span class=\"g-nav-header g-menu-item-content\"{{ title|raw }}>{{ self.displayTitle(item) }}</span>
                    {% else %}
                        <span class=\"g-separator g-menu-item-content\"{{ title|raw }}>{{ self.displayTitle(item) }}</span>
                    {% endif %}
                    {% if parent and not item.dropdown_hide -%}
                        <span class=\"g-menu-parent-indicator\"></span>
                    {%- endif %}
                {% endif %}
            {% if item.url %}</a>
            {% else %}</div>{% endif %}
            {% if parent -%}
                {{ self.displaySubmenu(item, menu, context, dropdown_type, start_level) }}
            {%- endif %}
        </li>
    {% endif %}
{% endmacro %}

{% macro displayContainers(item, menu, context, dropdown_type, start_level) %}
    {% import _self as self %}
    <div class=\"g-grid\">
        {% set groups = item.getDropdown() == 'standard' ? [item] : item.groups %}
        {% for column, items in groups %}
        <div class=\"g-block {{ item.columnWidth(column)|toGrid }}\">
            <ul class=\"g-sublevel\">
                <li class=\"g-level-{{ item.level - start_level + 1 }} g-go-back\">
                    <a class=\"g-menu-item-container\" href=\"#\" data-g-menuparent=\"\"><span>Back</span></a>
                </li>
                {{ self.displayItems(items, menu, context, dropdown_type, start_level) }}
            </ul>
        </div>
        {% endfor %}
    </div>
{% endmacro %}

{% macro displayItems(items, menu, context, dropdown_type, start_level) %}
    {% import _self as self %}
    {% for item in items %}
        {% set start_level = start_level ?? root_level ?? item.level %}
        {% set dropdown = dropdown_type ?? item.dropdown %}
        {{ self.displayItem(item, menu, context, dropdown, start_level) }}
    {% endfor %}
{% endmacro %}

{% macro displaySubmenu(item, menu, context, dropdown_type, start_level) %}
    {% import _self as self %}
    {% if not item.dropdown_hide %}
        {% set animation = context.gantry.config.get('styles.menu.animation')|default('g-fade') %}
        {% if ((item.groups|length == 1 and not dropdown_type == 'fullwidth') or dropdown_type == 'standard') or (item.width|default('auto') != 'auto' and dropdown_type == 'fullwidth')%}
            {% set dropdown_dir = 'g-dropdown-' ~ item.dropdown_dir|default('right') %}
        {% endif %}
        <ul class=\"g-dropdown g-inactive {{ animation }} {{ dropdown_dir }}\"{{ self.getCustomWidth(item, menu, 'submenu', dropdown_type, start_level) }}>
            <li class=\"g-dropdown-column\">
                {{ self.displayContainers(item, menu, context, dropdown_type, start_level) }}
            </li>
        </ul>
    {% endif %}
{% endmacro %}

{% import _self as macro %}

{% if menu.root.count() %}
    <nav class=\"g-main-nav\"{{ particle.mobileTarget ? ' data-g-mobile-target' : '' }} data-g-hover-expand=\"{{ particle.hoverExpand|default('true') ? 'true': 'false' }}\">
        <ul class=\"g-toplevel\">
            {{ macro.displayItems(menu.root, menu, _context) }}
        </ul>
    </nav>
{% endif %}
", "@particles/menu.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\particles\\menu.html.twig");
    }
}
